const jwt = require("jsonwebtoken")

module.exports = (req,res,next) =>{
    try {
        const token  = req.headers.authorization.split(" ")[1];
        const dycrptedtoken = jwt.verify(token,process.env.TOKEN);
        req.body.userId = dycrptedtoken.userId;
        next();
    } catch (error) {
        res.send({
            success:false,
            message: error.message,
        })
    }
} 