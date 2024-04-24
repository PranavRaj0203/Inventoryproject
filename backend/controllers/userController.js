const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_Secret, { expiresIn: "1d" })
};
// user registration
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    //validation
    if (!name || !email || !password) {
        res.status(400)
        throw new Error("Please fill in all required fields")
    }
    if (password.length < 6) {
        res.status(400)
        throw new Error("Password must be upto 6 characters")

    }
    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400)
        throw new Error("Email already exists")
    }

    //Create a new User

    const user = await User.create({
        name,
        email,
        password,
    })
    // token
    const token = generateToken(user._id);
    // ?cookie 
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400),//1d
        sameSite: "none",
        secure: true,

    });
    if (user) {
        const { _id, name, email, photo, phone, bio } = user
        res.status(201).json({
            _id, name, email, photo, phone, bio, token

        });
    }
    else {
        res.status(400)
        throw new Error("Invaid data")
    }
});
// log in
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    //Validation
    if (!email || !password) {
        res.status(400);
        throw new Error("Enter email and password");
    }
    const user = await User.findOne({ email })
    if (!user) {
        res.status(400);
        throw new Error("User not Found");
    }
    const passwordIsCorrect = await bcrypt.compare(password, user.password);
    // token
    const token = generateToken(user._id);
    // ?cookie 
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400),//1d
        sameSite: "none",
        secure: true,

    });

    if (user && passwordIsCorrect) {
        const { _id, name, email, photo, phone, bio } = user
        res.status(200).json({
            _id, name, email, photo, phone, bio, token,

        });
    }
    else {
        res.status(400);
        throw new Error("Invalid entry");
    }
});
// logout
const logout = asyncHandler(async (req, res) => {
    res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0),
        sameSite: "none",
        secure: true,

    });
    return res.status(200).json({message:"Logged out"})
});
//get user
const getUser = asyncHandler(async (req,res)=>{
    const user=await User.findById(req.user._id)
    if (user) {
        const { _id, name, email, photo, phone, bio } = user;
        res.status(201).json({
            _id, name, email, photo, phone, bio,

        });
    }
    else{
        res.status(400);
        throw new Error("User not found");
    }
});
//login status
const loginStatus=asyncHandler(async(req,res)=>{
    res.send("login");
});
module.exports = {
    registerUser,
    loginUser,
    logout,
    getUser,
    loginStatus,
};