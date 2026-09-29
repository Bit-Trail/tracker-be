const express = require('express');
const router = express.Router();
const {authenticateToken} = require('../middelware/auth.middleware');
const { getAllTasks, createTasks, updateTask, deleteTask } = require('../controllers/track.controller');


router.get("/", authenticateToken, (req,res)=>{
    getAllTasks(req, res);
});

router.post("/", authenticateToken, (req, res)=>{
    createTasks(req, res);
});

router.put("/:id", authenticateToken, (req, res)=>{
    updateTask(req, res);
});

router.delete("/:id", authenticateToken, (req, res)=>{
    deleteTask(req, res);
});

module.exports = router;
