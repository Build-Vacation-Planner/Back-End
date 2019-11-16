const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const dbAuth = require("./auth-model");
const generateToken = require("./generate-token");

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
