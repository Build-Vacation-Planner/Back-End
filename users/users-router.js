const router = require("express").Router();

router.get("/:id", async (req, res) => {
  //
  res.end();
});

router.post("/:id/vacation/", async (req, res) => {
  //
});

router.put("/:id/vacation/:id", async (req, res) => {
  //
});

router.delete("/:id/vacation/:id", async (req, res) => {
  //
});

module.exports = router;
