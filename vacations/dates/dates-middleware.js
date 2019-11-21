const dbVacations = require("../vacations-model");
const dbDates = require("./dates-model");

module.exports = { uniqueEntry, canModifyDates, datesIdExists };

async function uniqueEntry(req, res, next) {
  try {
    const dates = await dbDates.getBy({ vacation_id: req.vid });
    if (dates) {
      res.status(400).json({ message: "Vacation already has dates assigned" });
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to find unique entry in dates" });
  }
}

async function canModifyDates(req, res, next) {
  try {
    const vacation = await dbVacations.getBy({ id: req.vid });

    if (req.decodedJwt.id != vacation.owner_id) {
      res.status(403).json({
        message: "Sorry only the admin of the vacation can modify dates"
      });
    } else {
      next();
    }
  } catch (err) {
    console.error(err);

    res
      .status(500)
      .json({ error: "Failed to verify permission to modify the dates" });
  }
}

async function datesIdExists(req, res, next) {
  try {
    const dates = await dbDates.getBy({ id: req.params.id });

    dates && dates.vacation_id == req.vid
      ? next()
      : res.status(404).json({
          message: "Vacation doesn't have dates with that ID"
        });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to verify if the ID of the dates" });
  }
}
