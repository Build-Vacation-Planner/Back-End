const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const dbAuth = require("./auth-model");
const generateToken = require("./generate-token");

/**
 * @api {post} /api/auth/register Register User
 * @apiName Register User
 * @apiGroup Auth
 *
 * @apiParam {string} username User's name, unique, required
 * @apiParam {string} password User's password, required
 *
 * @apiParamExample {json} Example Body:
 * {
 *   "username": "joker",
 *   "password": "happyface"
 * }
 *
 * @apiSuccess (201) {Number} id User's id
 * @apiSuccess (201) {String} username User's name
 * @apiSuccess (201) {String} token User's access token
 *
 * @apiSuccessExample {json} Successful Response
 * {
 *   "id": 8,
 *   "username": "joker",
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImphbWJpczYiLCJpYXQiOjE1NzM5MjEyMjYsImV4cCI6MTU3NDAwNzYyNn0.lbAqXnl1s1aIK9TgMSFJNt2ej63lfqn_dsDdNpH1ZMs"
 * }
 *
 */

router.post("/register", async (req, res) => {
  let { username, password } = req.body;

  const hash = bcrypt.hashSync(password, 12);
  password = hash;

  try {
    const user = await dbAuth.add({ username, password });
    const token = generateToken(username);

    res.status(201).json({ ...user, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to register user" });
  }
});

/**
 * @api {post} /api/auth/login Login User
 * @apiName Login User
 * @apiGroup Auth
 *
 * @apiParam {string} username User's name, required
 * @apiParam {string} password User's password, required
 *
 * @apiParamExample {json} Example Body:
 * {
 *   "username": "joker",
 *   "password": "happyface"
 * }
 *
 * @apiSuccess (200) {String} message Welcome message
 * @apiSuccess (200) {String} token User's access token
 *
 * @apiSuccessExample {json} Successful Response
 * {
 *   "message": "Welcome joker",
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImphbWJpczYiLCJpYXQiOjE1NzM5MjEyMjYsImV4cCI6MTU3NDAwNzYyNn0.lbAqXnl1s1aIK9TgMSFJNt2ej63lfqn_dsDdNpH1ZMs"
 * }
 *
 */

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await dbAuth.getBy({ username });

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = generateToken(user.username);

      res.status(200).json({ message: `Welcome ${user.username}`, token });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to login" });
  }
});

module.exports = router;
