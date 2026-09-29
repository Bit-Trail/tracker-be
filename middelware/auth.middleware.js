const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1];

    if(!token){
        return res.status(401).json({"result":false, "reason":"Unauthorized Access"});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({"result":false, "reason":"Forbidden Access"});
    }
}

module.exports = { 
    authenticateToken
}