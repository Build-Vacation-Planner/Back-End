const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const dbAuth = require("./auth-model");

module.exports = { validateRegister, validateLogin };

async function validateRegister(req, res, next) {
  try {
    await body("username")
      .exists()
      .withMessage("Username field is required")
      .not()
      .isEmpty()
      .withMessage("Username cannot be empty")
      .run(req);
    await body("password")
      .exists()
      .withMessage("Password field is required")
      .not()
      .isEmpty()
      .withMessage("Password cannot be empty")
      .run(req);

    const result = validationResult(req);
    console.log(result);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    } else {
      const user = await dbAuth.getBy({ username: req.body.username });

      if (user) {
        return res.status(400).json({ error: "Username must be unique" });
      } else {
        next();
      }
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "Failed to validate user during registering" });
  }
}

async function validateLogin(req, res, next) {
  try {
    await body("username")
      .exists()
      .withMessage("Username field is required")
      .not()
      .isEmpty()
      .withMessage("Username cannot be empty")
      .run(req);
    await body("password")
      .exists()
      .withMessage("Password field is required")
      .not()
      .isEmpty()
      .withMessage("Password cannot be empty")
      .run(req);

    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to validate user during login" });
  }
}

function restricted(req, res, next) {
  const token = req.headers.authorization;
  const secret = process.env.JWT_SECRET;

  if (token) {
    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: "Invalid Credentials" });
      } else {
        req.decodedJwt = decodedToken;
        next();
      }
    });
  } else {
    res.status(401).json({ message: "Invalid Credentials" });
  }
}
