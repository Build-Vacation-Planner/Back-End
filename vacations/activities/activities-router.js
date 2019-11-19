const router = require("express").Router();

const dbActivities = require("./activities-model");

router.post("/", async (req, res) => {
  const { name } = req.body; //description

  try {
    const activity = await dbActivities.add({ name, vacation_id: req.vid });

    res.status(201).json(activity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create the activity" });
  }
});

router.put("/:id", async (req, res) => {
  const { name } = req.body; //conditional check name & description

  try {
    const activity = await dbActivities.update({ name }, req.params.id);

    activity
      ? res.status(202).json(activity)
      : res
          .status(404)
          .json({ message: "Activity with that ID was not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update the activity" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await dbActivities.remove(req.params.id);

    deleted
      ? res.status(202).json({ message: "Activity was deleted" })
      : res
          .status(404)
          .json({ message: "Activity with that ID was not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete activity" });
  }
});

module.exports = router;
