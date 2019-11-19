const dbPlaces = require("./dates-model");

module.exports = { uniqueEntry };

async function uniqueEntry(req, res, next) {
  try {
    const place = await dbPlaces.getBy({ vacation_id: req.vid });
    if (place) {
      res.status(400).json({ message: "Vacation already has dates assigned" });
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to find unique entry in places" });
  }
}
