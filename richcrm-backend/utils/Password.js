import crypto from 'crypto';

class PasswordUtil {
    static generateSalt() {
        return crypto.randomBytes(16).toString('hex');
    }

    static encrypt(password, salt) {
        return crypto.createHash('RSA-SHA256').update(password).update(salt).digest('hex');
    }

    static isValidPassword(targetPassword, enterPassword, salt) {
        const hashedPassword = PasswordUtils.hashPassword(enterPassword, salt);
        return hashedPassword === targetPassword;
    }
};

export default PasswordUtil;