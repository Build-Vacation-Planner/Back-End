const dbVacations = require("../vacations-model");
const dbUsers = require("./users-model");

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
