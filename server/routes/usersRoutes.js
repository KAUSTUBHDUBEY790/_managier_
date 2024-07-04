const router = require("express").Router();
const user = require("../modals/usermodule");
const bycrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const authmiddleware = require("../middlewares/authmiddleware")
//register new user
router.post("/register",async(req,res)=>{
    try {
    //check if the user already exist
    const Userexist = await user.findOne({email: req.body.email})
    if(Userexist)
    {
        throw new Error("User already exist")
    }
    //create a hashed password
    const salt = await bycrypt.genSalt(10)
    const hashedpassword = await bycrypt.hash(req.body.password, salt);
    req.body.password = hashedpassword;

    //save the user
    const User = new user(req.body)
    await User.save();
    res.send({
        success: true,
        message: "User registered successfully",
    })
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        })
        
    }
})

router.post('/login',async(req,res)=>{
    try {
        //check for user
        const User = await user.findOne({email:req.body.email});
        if(!User)
        {
            throw new Error("User does not exist")
        }
// compare the password
        const passwordev = await bycrypt.compare(
            await req.body.password,
            User.password,
        )
        if(!passwordev){
            throw new Error("Wrong password");
        }
// generate token for the logined user
const token = jwt.sign({ userId : User._id},process.env.TOKEN,{expiresIn:"1d"})
res.send({
    success:true,
    data: token,
    message: "User logged in sucessfully",
})
        
    } catch (error) {
        res.send({
            success:false,
            message: error.message,
        })
        
    }
})

router.get('/loggedin-user',authmiddleware, async(req,res)=>{
    //send user info
    try {
        const User = await user.findOne({_id:req.body.userId});
        User.password = undefined;
        res.send({
            success: true,
            data: User,
            message: "Authentication sucessful",
        });      
    } catch (error) {
        res.send({
            success:false,
            message: error.message,
        })
    }
});
module.exports = router;