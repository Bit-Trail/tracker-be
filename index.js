const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const authRoute = require('./routers/auth.route');
const trackerRoute = require('./routers/tracker.route');

app.use(cors());
app.use(express.json());



app.get("/", (req,res)=>{
    res.send("Welcome to Tracker Backend");
});

app.use('/auth', authRoute);
app.use('/tracker', trackerRoute);

app.listen(port, ()=>{console.log("Tracker Backend is running in ",port)});