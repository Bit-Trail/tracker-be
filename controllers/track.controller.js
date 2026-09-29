const pool = require('../db');

async function getAllTasks(req, res){
    try {
        const tasks = await pool.query("SELECT * FROM tasks where user_id = $1",[req.user.id]);
        if(tasks.rowCount === 0){
            return res.status(200).json({"result":true, "reason":"Tasks fetched successfully", "data": []});
        }
        return res.status(200).json({"result":true, "reason":"Tasks fetched successfully", "data": tasks.rows});
    } catch (error) {
        if (error.code && (error.code.startsWith('23') || error.code.startsWith('22'))){
            return res.status(400).json({"result":false, "reason":"Database Constrain Error", "data": error.message});
        }
        return res.status(500).json({"result":false, "reason":"Internal Server Error", "data": ""})
    }
}

async function createTasks(req,res){
    try {
        if(!req.body.title || !req.body.description) {
            return res.status(400).json({"result":false, "reason":"Please input all the mandatory parameters.", "data": ""});
        }
        const curStatus = req.body.status || 'new';
        const curCategory = req.body.category || 'personal';
        const Duedate = req.body.due_date || null;
        const newTask = await pool.query("INSERT INTO tasks (title, description, status, user_id, category, due_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",[req.body.title, req.body.description, curStatus, req.user.id, curCategory, Duedate]);
        if(newTask.rowCount == 1){
            return res.status(201).json({"result":true, "reason":"Tasks created successfully", "data": newTask.rows[0]});
        }
        return res.status(500).json({"result":false, "reason":"Task creation failed unexpectedly", "data": ""});
    } catch (error) {
        if (error.code && (error.code.startsWith('23') || error.code.startsWith('22'))){
            return res.status(400).json({"result":false, "reason":"Database Constrain Error", "data": error.message});
        }
        return res.status(500).json({"result":false, "reason":"Internal Server Error", "data": ""});
    }
}

async function updateTask(req,res){
    try {
        const fields = [];
        const values = [];
        let sqlIndex = 1;
        if(req.body.title){
            fields.push(`title = $${sqlIndex}`);
            values.push(req.body.title);
            sqlIndex++;
        }
        if(req.body.description){
            fields.push(`description = $${sqlIndex}`);
            values.push(req.body.description);
            sqlIndex++;
        }
        if(req.body.status){
            fields.push(`status = $${sqlIndex}`);
            values.push(req.body.status);
            sqlIndex++;
        }
        if(req.body.category){
            fields.push(`category = $${sqlIndex}`);
            values.push(req.body.category);
            sqlIndex++;
        }
        if(req.body.due_date){
            fields.push(`due_date = $${sqlIndex}`);
            values.push(req.body.due_date);
            sqlIndex++;
        }
        if (fields.length === 0) {
            return res.status(400).json({
                result: false,
                reason: "No valid fields provided for update",
                data: ""
            });
        }
        values.push(req.params.id, req.user.id);
        const setClause = fields.join(', ');
        const query = `UPDATE tasks SET ${setClause}, modified_at = NOW() WHERE id = $${sqlIndex} AND user_id = $${sqlIndex + 1} RETURNING *`;
        const updatetask = await pool.query(query, values);
        if(updatetask.rowCount === 1){
            return res.status(200).json({"result":true, "reason":"Tasks updated successfully", "data": updatetask.rows[0]})
        }
        return res.status(500).json({"result":false, "reason":"Task updation failed unexpectedly", "data": ""});
    } catch (error) {
        if (error.code && (error.code.startsWith('23') || error.code.startsWith('22'))){
            return res.status(400).json({"result":false, "reason":"Database Constrain Error", "data": error.message});
        }
        return res.status(500).json({"result":false, "reason":"Internal Server Error", "data": ""});
    }
}

async function deleteTask(req, res){
    try {
        const deletetask = await pool.query("DELETE FROM tasks WHERE id = $1 AND user_id = $2", [req.params.id, req.user.id]);
        if(deletetask.rowCount === 1){
            return res.status(200).json({"result":true, "reason":"Task Deleted successfully"});
        }
        return res.status(404).json({"result":false, "reason":"Invalid task to delete."});
    } catch (error) {
        if (error.code && (error.code.startsWith('23') || error.code.startsWith('22'))){
            return res.status(400).json({"result":false, "reason":"Database Constrain Error", "data": error.message});
        }
        return res.status(500).json({"result":false, "reason":"Internal Server Error", "data": ""});
    }
}

module.exports = {
    getAllTasks,
    createTasks,
    updateTask,
    deleteTask
}