// const jwt = require('jsonwebtoken');
import { sign, verify, decode } from 'jsonwebtoken';

/**
 * Json Web Token Util Class 
 * 
 *  do not construct object with init constructor, it is utility class
 * 
 * @class
 */
class JwTokenUtil {
    /**
     * generate a new Access Token
     * 
     * @param {object} data - data to be encoded in the token
     * @param {string} secret - secret key to be used for signing 
     * @param {string} [timeTravel='1h'] - time to expire the token, default is 1 hour
     * 
     * @return {string} encoded string with signature, format will be [encoded.encoded.signature]
     */
    static generateAccessToken(data, secret, timeTravel = '1h') {
        return sign(data, secret, { expiresIn: timeTravel });
    }

    /**
     *  check if given token is valid
     * 
     * @param {string} token - an refresh / access token string
     * @param {string} secret - secret key to be used for signing 
     * @returns {boolean} true if token is valid, false otherwise
     * 
     * token without signature or expired will be considered invalid
     */
    static async isValid(token, secret) {
        try {
            const promise = new Promise((resolve, reject) => {
                verify(token, secret, (err, data) => {
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
                });
            }); 
            return promise;
        } catch (err) {
            throw err;
        }
    }

    /**
     * decode token and return its payload data
     * 
     * @param {string} token - an refresh / access token string
     * @returns {object} token payload data
     */
    static decodeToken(token) {
        try {   
            const decoded = decode(token);
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

module.exports = JwTokenUtil;