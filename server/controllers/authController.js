const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { User } = require('../models');

const logAndSendError = (res, error, message) => {
    console.error(message, error);
    res.status(500).send('Server error');
};


exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, securityQuestion, securityAnswer } = req.body;

    try {
        let user = await User.findOne({ where: { username } });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            username,
            password,
            securityQuestion,
            securityAnswer
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        console.log('User successfully registered:', user);

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        logAndSendError(res, err, 'Register user error:');
    }
};


exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
        let user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        console.log('JWT_SECRET in login:', process.env.JWT_SECRET); 

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        logAndSendError(res, err, 'Login user error:');
    }
};


exports.forgotPassword = async (req, res) => {
    const { username } = req.body;

    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json({ securityQuestion: user.securityQuestion });
    } catch (error) {
        logAndSendError(res, error, 'Forgot Password error:');
    }
};


exports.checkSecurityAnswer = async (req, res) => {
    const { username, securityAnswer } = req.body;

    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (user.securityAnswer !== securityAnswer) {
            return res.status(400).json({ msg: 'Incorrect security answer' });
        }

        res.json({ msg: 'Correct answer' });
    } catch (error) {
        logAndSendError(res, error, 'Check Security Answer error:');
    }
};

exports.resetPassword = async (req, res) => {
    const { username, newPassword } = req.body;

    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ msg: 'Password reset successfully' });
    } catch (error) {
        logAndSendError(res, error, 'Reset Password error:');
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['username']
        });
        res.json(user);
    } catch (err) {
        logAndSendError(res, err, 'Get user error:');
    }
};
