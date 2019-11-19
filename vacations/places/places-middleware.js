const dbPlaces = require("./places-model");

module.exports = { uniqueEntry };

async function uniqueEntry(req, res, next) {
  try {
    const place = await dbPlaces.getBy({ vacation_id: req.vid });
    if (place) {
      res
        .status(400)
        .json({ message: "Vacation already has a location designated" });
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to find unique entry in places" });
  }
}
