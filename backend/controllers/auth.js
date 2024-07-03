const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.postLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    if (!password) {
        return res.status(400).json({ message: "Password is required" });
    }
    const userInfo = await User.findOne({ email });

    if (!userInfo) {
        return res.status(400).json({ error: true, message: "User not found" });
    }

    const result = await bcrypt.compare(password, userInfo.password);

    if (result) {
        const user = { user: userInfo };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '36000m',
        })
        return res.json({
            error: false,
            message: 'Login Successful',
            email,
            accessToken,
        });
    }
    else {
        return res.status(400).json({
            error: true,
            message: "Invalid Credentials"
        })
    }
};

exports.postCreateAccount = async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName) {
        return res.status(400).json({ error: true, message: 'Full Name is required' });
    }
    if (!email) {
        return res.status(400).json({ error: true, message: 'Email is required' });
    }
    if (!password) {
        return res.status(400).json({ error: true, message: 'Password is required' });
    }

    const isUser = await User.findOne({ email });

    if (isUser) {
        return res.json({ error: true, message: 'User already exist' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
        fullName,
        email,
        password: hashedPassword
    });

    await user.save();

    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '36000m',
    });

    return res.json({
        error: false,
        user,
        accessToken,
        message: 'Registration Successful'
    });
};

exports.getUser = async (req, res) => {
    const { user } = req.user;

    const isUser = await User.findOne({ _id: user._id });

    if (!isUser) {
        return res.sendStatus(401);
    }

    return res.json({
        user: {
            fullName: isUser.fullName,
            email: isUser.email,
            _id: isUser._id,
            createdOn: isUser.createdOn,
        },
        message: "",
    });
};