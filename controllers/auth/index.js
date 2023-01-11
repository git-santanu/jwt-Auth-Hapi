const Jwt = require("@hapi/jwt");
const { success, error } = require('../../response/macros');
const user = require('../../models').user;
const { verifyPassword } = require('../helper');

exports.jwtAuthentication = async (server) => {
  await server.register(Jwt);
  server.auth.strategy("my_jwt_strategy", "jwt", {
    keys: "secret_key", // we can also use env here
    verify: {
      aud: "urn:audience:test",
      iss: "urn:issuer:test",
      sub: false,
      nbf: true,
      exp: true,
      maxAgeSec: 14400, // 4 hours
      timeSkewSec: 15,
    },
    validate: (artifacts, request, h) => {
      request.user = artifacts.decoded.payload.user;

      return {
        isValid: true,
        credentials: { user: artifacts.decoded.payload.user },
      };
    },
  });
  server.auth.default("my_jwt_strategy");
};
exports.loginUser = async (req, res) => {
  try {
    const rb = req.payload;
    console.log('req>>>>',rb)
    const userExists = await user.findOne({
      where: {
        email: rb.email,
      }
    });
    if (!userExists) {
      return success({ error: "Wrong email" })(res);
    }
    let hashedPassword = userExists.password;
    let checkPassword = verifyPassword(rb.password, hashedPassword),
      token;
    if (checkPassword) {
      delete userExists.dataValues.password;

      token = Jwt.token.generate(
        {
          expiresIn: 36000,
          aud: "urn:audience:test",
          iss: "urn:issuer:test",
          sub: false,
          maxAgeSec: 14400,
          timeSkewSec: 15,
          user: userExists,
        },
        "secret_key"
      ); // we can also use process.env instead of secret key
    }
    return success({ token, user: userExists })(res);
  } catch (err) {
    console.log(err);
    return error(err.message)(res);
  }
};

