const dbVacations = require("../vacations-model");
const dbActivity = require("./activities-model");

module.exports = { canModifyActivity, activityIdExists };

async function canModifyActivity(req, res, next) {
  try {
    const vacation = await dbVacations.getBy({ id: req.vid });

    if (req.decodedJwt.id != vacation.owner_id) {
      res.status(403).json({
        message: "Sorry only the admin of the vacation can modify activities"
      });
    } else {
      next();
    }
  } catch (err) {
    console.error(err);

    res
      .status(500)
      .json({ error: "Failed to verify permission to modify the comment" });
  }
}

async function activityIdExists(req, res, next) {
  try {
    const activity = await dbActivity.getBy({ id: req.params.id });

    activity
      ? next()
      : res
          .status(404)
          .json({ message: "Activity with that ID doesn't exist" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Failed to verify if the ID of the Activity" });
  }
}
