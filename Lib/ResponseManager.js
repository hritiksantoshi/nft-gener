const { APP_CONSTANTS } = require('../Config');
const statusCodes = APP_CONSTANTS.STATUS_CODES;
const messages = APP_CONSTANTS.MESSAGES;

const sendResponse = async (res, code, message, data) => {
	code = code || statusCodes.SUCCESS;
	message = message || messages.SUCCESS;
	data = data || {};
	return res.status(code).send({
		statusCode: code,
		message: message,
		data: data
	});
};

const unauthorizedResponse = async (res, message) => {
	const code = statusCodes.UNAUTHORIZED;
	message = message || messages.UNAUTHORIZED;
	return res.status(code).send({
		statusCode: code,
		message: message
	});
};

const forBiddenResponse = async (res, message) => {
	const code = statusCodes.FORBIDDEN;
	message = message || messages.FORBIDDEN;
	return res.status(code).send({
		statusCode: code,
		message: message
	});
};

const validationError = async (res, error) => {
	const code = statusCodes.UNPROCESSABLE_ENTITY;
	return res.status(code).send({
		statusCode: code,
		message:error.message.replace(new RegExp('\\"',"g"),"") 
	});
};

const errorResponse = async (res, error) => {
	const code = statusCodes.INTERNAL_SERVER_ERROR;
	console.error(error);
	return res.status(code).send({
		statusCode: code,
		message:messages.SERVER_ERROR
	});
};

module.exports = {
	errorResponse: errorResponse,
	sendResponse: sendResponse,
	unauthorizedResponse: unauthorizedResponse,
	forBiddenResponse: forBiddenResponse,
	validationError: validationError
}