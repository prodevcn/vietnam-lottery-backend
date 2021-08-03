exports.setUserInfo = function setUserInfo(request) {
    const getUserInfo = {
        _id: request._id,
        email: request.email,
        firstName: request.firstName,
        lastName: request.lastName,
        balance: request.balance
    };
    return getUserInfo;
};