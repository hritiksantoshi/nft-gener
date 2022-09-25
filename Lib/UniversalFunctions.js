module.exports.returnData = (status,message,data)=>{
    return {
        status:status,
        message:message,
        data:data
    }
};
module.exports.returnError = (status,message)=>{
    return {
        status:status,
        message:message
    }
};
