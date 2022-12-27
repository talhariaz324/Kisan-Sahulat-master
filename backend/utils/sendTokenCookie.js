// Sending Token and saving to cookie
const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  // Options for cookie which tell when expire etc

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, //If the HttpOnly flag (optional) is included in the HTTP response header,
    //the cookie cannot be accessed through client side script (again if the
    //browser supports this flag).

    /*If a browser does not support HttpOnly and a website attempts to set an HttpOnly cookie,
the HttpOnly flag will be ignored by the browser, thus creating a traditional, 
script accessible cookie. 
- As a result, the cookie (typically your session cookie) 
becomes vulnerable to theft of modification by malicious script. */
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};

module.exports = sendToken;
