const router = require("express").Router();

const dbPlaces = require("./places-model");
const { uniqueEntry } = require("./places-middleware");

router.post("/", uniqueEntry, async (req, res) => {
  const { name } = req.body;

  try {
    const place = await dbPlaces.add({ name, vacation_id: req.vid });

    res.status(201).json(place);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add the place" });
  }
});

router.put("/:id", async (req, res) => {
  const { name } = req.body;

  try {
    const place = await dbPlaces.update({ name }, req.params.id);

    place
      ? res.status(202).json(place)
      : res.status(404).json({ message: "Place with that ID was not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update the place" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await dbPlaces.remove(req.params.id);

    deleted
      ? res.status(202).json({ message: "Place was deleted" })
      : res.status(404).json({ message: "Place with that ID was not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete the place" });
  }
});

module.exports = router;
