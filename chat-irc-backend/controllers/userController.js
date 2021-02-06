const mongoose = require('mongoose');
const User = mongoose.model("User");
const sha256 = require("js-sha256");
const jwt = require('jwt-then');

exports.register = async (req, res) =>{
    const {name, email, password} = req.body;

    const emailRegex = /@gmail.com|@yahoo.com|@hotmail.com|@outlook.com|@epitech.eu/;

    if (!emailRegex.test(email)) throw "email is not supported from your domain.";
    if (password.length < 6) throw "Password must be atleast 6 characters long";

    const userExists = await User.findOne({
        email,
    });

    if (userExists) throw "User with the same email already exists."

    const user = new User({name, email, password: sha256(password + process.env.SALT)});

    await user.save();

    res.json({
        message: "User [" + name + "] registered succesfully!",
    });
};

exports.login = async (req, res) =>{
    const {email, password} = req.body;
    const user = await User.findOne({
        email, 
        password: sha256(password + process.env.SALT),
    });

    if (!user) throw "Email and Password did not match.";

    const token = await jwt.sign({id: user._id}, process.env.SECRET);

    res.json({
        message: "User logged in succesfully!",
        token,
    });
};

exports.getAllUsers = async (req, res) => {
    const users = await User.find({});
  
    res.json(users);
  };