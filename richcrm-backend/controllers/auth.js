var UserService = require('../db/user/user.service');

class AuthController {
    async registerUser(req, res) {
        const {emailAddress, password, userName, role} = req.body;
        try {
            const existingUser = await UserService.readUser(emailAddress);
            if (existingUser !== null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: 'User already exists'
                });
            }
            const user = await UserService.createUser({emailAddress, password, userName, role});
            if (user !== null) {
                res.status(200).json({
                    status: "success",
                    data: [{
                        emailAddress: user.EmailAddress,
                        password: user.Password,
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
            if (user.Password !== password) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: 'Invalid password'
                });
            }
            res.status(200).json({
                status: "success",
                data: [{
                    emailAddress: user.EmailAddress,
                    password: user.Password,
                    userName: user.UserName,
                    role: user.Role
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
}

module.exports = new AuthController();