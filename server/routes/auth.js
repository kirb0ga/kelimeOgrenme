const express = require('express');
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post(
    '/register',
    [
        check('username', 'Username is required').not().isEmpty(),
        check('password', 'Password is required').not().isEmpty(),
        check('securityQuestion', 'Security Question is required').not().isEmpty(),
        check('securityAnswer', 'Security Answer is required').not().isEmpty(),
    ],
    authController.register
);

router.post(
    '/login',
    [
        check('username', 'Username is required').not().isEmpty(),
        check('password', 'Password is required').not().isEmpty(),
    ],
    authController.login
);

router.post('/forgot-password', authController.forgotPassword);
router.post('/check-security-answer', authController.checkSecurityAnswer);
router.post('/reset-password', authController.resetPassword);
router.get('/user', auth, authController.getUser);

module.exports = router;
