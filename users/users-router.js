const router = require("express").Router();

const dbUsers = require("./users-model");

router.get("/:uid", async (req, res) => {
  //
  res.end();
});

//create friendlist

module.exports = router;
