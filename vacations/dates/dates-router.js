const router = require("express").Router();

const dbDates = require("./dates-model");
const { uniqueEntry } = require("./dates-middleware");

router.post("/", uniqueEntry, async (req, res) => {
  const { start, end } = req.body;

  try {
    const dates = await dbDates.add({ start, end, vacation_id: req.vid });

    res.status(201).json(dates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add the dates" });
  }
});

router.put("/:id", async (req, res) => {
  const { start, end } = req.body; //conditionally check for these to exist in middleware

  try {
    const dates = await dbDates.update({ start, end }, req.params.id);

    dates
      ? res.status(202).json(dates)
      : res.status(404).json({ message: "Dates with that ID was not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update the dates" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await dbDates.remove(req.params.id);

    deleted
      ? res.status(202).json({ message: "Dates were deleted" })
      : res.status(404).json({ message: "Dates with that ID was not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete the dates" });
  }
});

module.exports = router;
