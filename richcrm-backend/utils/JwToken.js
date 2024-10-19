import jwt from 'jsonwebtoken';

class JwTokenUtil {
    static generateAccessToken(data, secret, timeTravel = process.env.REFRESH_TOKEN_TIME_EXPIRATION) {
        return jwt.sign(data, secret, { expiresIn: timeTravel });
    }

    static async isValid(token, secret) {
        try {
            const promise = new Promise((resolve, reject) => {
                jwt.verify(token, secret, (err, data) => {
                    if (err) {
                        let err = new Error();
                        err.message = 'error invalid token';
                        err.status = 401;
                        reject(err);
                    } else {
                        const retData = {
                            ... data
                        }
                        resolve(retData);
                    }
                })
            }); 
            return promise;
        } catch (err) {
            throw err;
        }
    }

    static decodeToken(token) {
        try {   
            const decoded = jwt.decode(token);
            if (decoded !== undefined) {
                const ret = {
                    ...decoded
                };
                return ret;
            } else {
                return null;
            }
        } catch (err) {
            console.error('decoded fail:', err);
            throw err;
        }
    }
};

export default JwTokenUtil;