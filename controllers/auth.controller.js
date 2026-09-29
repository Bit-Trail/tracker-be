const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db');
const saltRound = 10;
const jwt = require('jsonwebtoken');
require('dotenv').config();


async function register(req, res){
    try {
        const user = req.body

        if(!user.name || !user.email || !user.password){
            return res.status(400).json({"result":false, "reason":"Please check all the parameters (name, email, password)"});
        }

        const existingUser = await pool.query("SELECT * FROM users WHERE email = $1",[user.email]);
        if(existingUser.rowCount > 0){
            return res.status(409).json({"result":false, "reason":"Email Already exists"});
        }
        
        const hashedpassword = await bcrypt.hash(user.password, saltRound);
        const newUser = await pool.query("INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING id, name, email",[user.name, user.email, hashedpassword]);
        return res.status(201).json({"result":true, "reason":"User registered successfully", "data":newUser.rows[0]});
        
    } catch (error) {
        if(error.code){
            if(error.code.startsWith("22")|| error.code.startsWith("23")){
                return res.status(400).json({"result":false, "reason":"Database Error", "data": error.message});
            }
        }
        return res.status(500).json({"result":false, "reason":"Internal Server Error", "data": ""});
    }
}


async function login(req, res){
    const user = req.body;
    try {
        if(!user.email || !user.password){
            return res.status(400).json({"result":false, "reason":"Please fill all parameters. (email, password)"});
        }
        const checkEmail = await pool.query("SELECT  id,name,email,password FROM users WHERE email = $1",[user.email]);
        if(checkEmail.rowCount>0){
            const storedPassword = checkEmail.rows[0].password;
            const isMatch = await bcrypt.compare(user.password, storedPassword);
            if(isMatch){
                const payload = {
                    id: checkEmail.rows[0].id,
                    username: checkEmail.rows[0].name,
                    email: checkEmail.rows[0].email
                };
                const token = jwt.sign(
                    payload, 
                    process.env.JWT_TOKEN,
                    {expiresIn: '1h'}
                );
                return res.status(200).json({"result":true, "reason":"User Logined Successfully","data": {"access_token": token, "username": checkEmail.rows[0].name}});
            }
        }
        return res.status(401).json({"result":false, "reason":"Invalid Credentials"})
    } catch (error) {
        if(error.code){
            if(error.code.startsWith("22")|| error.code.startsWith("23")){
                return res.status(400).json({"result":false, "reason":"Database Error", "data": error.message});
            }
        }
        return res.status(500).json({"result":false, "reason":"Internal Server Error", "data": ""});
    }
}

module.exports = {
    register,
    login
}