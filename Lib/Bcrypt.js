const bcrypt = require('bcrypt');

const hashPassword = async (plainTextPassword) => {
	const saltRounds = 10;
	return bcrypt.hashSync(plainTextPassword, saltRounds);
};

const comparePassword = async (plainTextPassword, hashedPassword) => {
	return bcrypt.compareSync(plainTextPassword, hashedPassword);
};

module.exports = {
    hashPassword,
    comparePassword
}