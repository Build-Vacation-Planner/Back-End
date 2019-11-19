const router = require("express").Router();

const dbUsers = require("./users-model");

router.get("/", async (req, res) => {
  try {
    const result = await dbUsers.getAllForUser(req.decodedJwt.id);

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retreive user's info" });
  }
});

//create friendlist

module.exports = router;
