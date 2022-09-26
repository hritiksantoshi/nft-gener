const { Users } = require('../Models');
const { errorResponse, forBiddenResponse, unauthorizedResponse } = require('../Lib/ResponseManager');
const { MESSAGES } = require("../Config/appConstants");
const JWT = require('../Lib/JsonWebToken');
module.exports = (userType) => async (req, res, next) => {
    try {
        if (req.headers.authorization) {

            let accessToken = req.headers.authorization;

            if (accessToken.startsWith('Bearer')) {
                [, accessToken] = accessToken.split(' ');
            };

            const decodedData = JWT.Verify(accessToken);
            let userData = await Users.findById(decodedData._id, { password: 0 });

            if (userData) {

                if (userData.isBlocked) {
                    return forBiddenResponse(res, MESSAGES.USER_NOT_ALLOWDED_TO_LOGIN);
                }

                else if (userData.isDeleted) {
                    return forBiddenResponse(res, MESSAGES.USER_NOT_FOUND);
                }

                else if (userData.userType !== userType) {
                    return forBiddenResponse(res, MESSAGES.USER_NOT_ALLOWDED_TO_ACCESS_THIS_PAGE);
                }

                req.loggedUser = userData;
                next();

            }
            else {
                return forBiddenResponse(res, MESSAGES.INVALID_TOKEN);
            }

        }
        else {

            return unauthorizedResponse(res, MESSAGES.UNAUTHORIZED);

        }

    } catch (error) {

        return forBiddenResponse(res, MESSAGES.INVALID_TOKEN);

    }
}
