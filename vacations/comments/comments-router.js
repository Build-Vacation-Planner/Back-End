const router = require("express").Router();

const dbComments = require("./comments-model");

router.post("/", async (req, res) => {
  const { title, body } = req.body;

  try {
    const comment = await dbComments.add({
      title,
      body,
      created_by: req.decodedJwt.id,
      vacation_id: req.vid
    });

    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send the comment" });
  }
});

router.put("/:id", async (req, res) => {
  const { title, body } = req.body; //conditional check name & description

  try {
    const comment = await dbComments.update({ title, body }, req.params.id);

    comment
      ? res.status(202).json(comment)
      : res.status(404).json({ message: "Comment with that ID was not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update the comment" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await dbComments.remove(req.params.id);

    deleted
      ? res.status(202).json({ message: "Comment was deleted" })
      : res.status(404).json({ message: "Comment with that ID was not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

module.exports = router;
