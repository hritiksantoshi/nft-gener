const { validationErrorResponse } = require("../Lib/ResponseManager");

module.exports = function (schema) {

    return function (req, res, next) {
        try {
            if (schema.body) {
                const { error, value } = schema.body.validate(req.body);
                if (error) throw error;
                req.body = value;
            }
            if (schema.query) {
                const { error, value } = schema.query.validate(req.query);
                if (error) throw error;
                req.query = value;
            }
            if(schema.params){
                const { error, value } = schema.params.validate(req.params);
                if (error) throw error;
                req.params = value;
            }
            next();
        } catch (error) {
            return validationErrorResponse(res, error);
        }
    }
}