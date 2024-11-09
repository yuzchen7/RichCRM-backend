var UserService = require('../db/user/user.service');
const PasswordUtils = require('../utils/Password');
const JwTokenUtil = require('../utils/JwToken');
const ses = require('../services/ses');

const PASSWORD_RESET_EXP_LENGTH = 10 * 60 * 1000; // 10 minutes

class AuthController {
    async registerUser(req, res) {
        const {emailAddress, password, userName, role} = req.body;
        let salt = PasswordUtils.generateSalt();
        try {
            const existingUser = await UserService.readUser(emailAddress);
            if (existingUser !== null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: 'User already exists'
                });
            }
            const user = await UserService.createUser({emailAddress, password: PasswordUtils.encrypt(password, salt), salt, userName, role});
            if (user !== null) {
                res.status(200).json({
                    status: "success",
                    data: [{
                        emailAddress: user.EmailAddress,
                        // password: user.Password,
                        userName: user.UserName,
                        role: user.Role
                    }],
                    message: 'User created successfully'
                });
            } else {
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: 'User creation failed'
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: 'Internal server error'
            });
        }
        res.end();
    }

    async loginUser(req, res) {
        const {emailAddress, password} = req.body;
        try {
            const user = await UserService.readUser(emailAddress);
            if (user === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: 'User not found'
                });
            }
            
            if (!PasswordUtils.isValidPassword(user.Password, password, user.Salt)) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: 'Invalid password'
                });
            }

            delete user.Password;
            delete user.Salt;
            delete user.RefreshToken;
            
            let accessToken, refreshToken = undefined;
            accessToken = JwTokenUtil.generateToken(user, process.env.ACCESS_TOKEN_KEY, process.env.ACCESS_TOKEN_TIME_EXPIRATION);
            refreshToken = JwTokenUtil.generateToken(user, process.env.REFRESH_TOKEN_KEY, process.env.REFRESH_TOKEN_TIME_EXPIRATION);
            if (accessToken === undefined || refreshToken === undefined) {
                throw new Error('token generation failed');
            }
            
            const tokenResult = await UserService.updateUser({
                emailAddress: user.EmailAddress,
                refreshToken
            });
            if (tokenResult === undefined || tokenResult === null) {
                throw new Error('refresh token update failed');
            }

            res.status(200).json({
                status: "success",
                data: [{
                    emailAddress: user.EmailAddress,
                    userName: user.UserName,
                    role: user.Role,
                    token: {
                        access: accessToken,
                        refresh: refreshToken
                    }
                }],
                message: 'User logged in successfully'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: 'Internal server error'
            });
        }
        res.end();
    }

    async deleteUser(req, res) {
        const {emailAddress, password} = req.body;
        try {
            const user = await UserService.readUser(emailAddress);
            if (user.Password !== password) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: 'Invalid password'
                });
            }
            const result = await UserService.deleteUser(emailAddress);
            if (result === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: 'User not found'
                });
            }
            res.status(200).json({
                status: "success",
                data: [result],
                message: 'User deleted successfully'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: 'Internal server error'
            });
        }
        res.end();
    }

    async updateUser(req, res) {
        const {emailAddress, password, userName, role} = req.body;
        try {
            const user = await UserService.readUser(emailAddress);
            if (user === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: 'User not found'
                });
            }
            const result = await UserService.updateUser({emailAddress, password, userName, role});
            if (result === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: 'Update user failed'
                });
            }
            res.status(200).json({
                status: "success",
                data: [{
                    password: result.Password,
                    userName: result.UserName,
                    role: result.Role
                }],
                message: 'User updated successfully'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: 'Internal server error'
            });
        }
        res.end();
    }

    async refresh(req, res) {
        const token = req.body.token;
        try {
            const tokenPayload = await JwTokenUtil.verify(token, process.env.REFRESH_TOKEN_KEY); 

            const user = await UserService.readUser(tokenPayload.EmailAddress);
            if (user === null ) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: 'User invalid error'
                });
            }

            if (user.RefreshToken !== token) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: 'Token invalid error'
                });
            }

            let accessToken = JwTokenUtil.generateToken(user, process.env.ACCESS_TOKEN_KEY, process.env.ACCESS_TOKEN_TIME_EXPIRATION);

            res.status(200).json({
                status: "success",
                data: [{
                    token: {
                        access: accessToken
                    }
                }],
                message: 'Token refreshed successfully'
            });

        } catch (error) {
            console.error(error);

            if (error.name === 'TokenExpiredError') {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: 'Token expired error'
                });
            }

            res.status(500).json({
                status: "failed",
                data: [],
                message: 'Internal server error'
            });
        }

        res.end();
    }

    async me(req, res) {
        const emailAddress = req.user.EmailAddress;
        try {
            const user = await UserService.readUser(emailAddress);
            if (user === null) {
                return res.status(500).json({
                    status: "failed",
                    data: [],
                    message: 'User info failed'
                });
            } 
            return res.status(200).json({
                status: "success",
                data: [{
                    emailAddress: user.EmailAddress,
                    userName: user.UserName,
                    role: user.Role
                }],
                message: 'User info successfully'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: 'Internal server error'
            });
        }
        res.end();
    }

    async resetPasswordRequest(req, res) {
        const { email } = req.body;
        try {   
            const user = await UserService.readUser(email);
            if (user === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: 'User not found'
                });
            }

            const verificationCode = PasswordUtils.generateVerificationCode(6);
            var expDate = new Date();
            expDate.setTime(expDate.getTime() + PASSWORD_RESET_EXP_LENGTH);
            const result = await UserService.updateUser({
                emailAddress: user.EmailAddress,
                verificationCode: verificationCode,
                verificationExp: expDate
            });

            if (result === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: 'User reset password request failed'
                });  
            }

            // TODO: need a better template format for email verification
            const returnData = await ses.sendEmail({
                toAddresses: [user.EmailAddress],
                templateContent: `Dear customer ${user.UserName},\n\nPlease use the following verification code to reset your password: ${verificationCode}\nThis code will expire in 10 minutes.\nIf you did not request a password reset, please ignore this email.\nThank you for using our service!\n\nSincerely,\nRichCRM Team`,
                templateTitle: 'Password reset request verification'
            });

            return res.status(200).json({
                status: "success",
                data: [],
                message: 'User reset password request successfully'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: 'Internal server error'
            });
        }
        res.end();
    }
}

module.exports = new AuthController();