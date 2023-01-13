function success(data, message = "Success", statusCode = 200) {
    return (res) => res.response({ 
        statusCode,
        message,
        data
    }).code(statusCode)
}

function error(data, message = "Error", statusCode = 500) {
    return (res) => res.response({ 
        statusCode,
        message,
        data
    }).code(statusCode)
}

function invalidData(data, message = "Invalid Data", statusCode = 400) {
    return (res) => res.response({ 
        statusCode,
        message,
        data
    }).code(statusCode)
}

module.exports = {
    success,
    error,
    invalidData
}