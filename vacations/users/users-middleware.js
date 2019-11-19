const { body, validationResult } = require("express-validator");

const dbVacations = require("../vacations-model");

module.exports = { userIsOwner };

async function userIsOwner(req, res, next) {
  try {
    const vacation = await dbVacations.getBy({ id: req.vid });
    if (req.decodedJwt.id != vacation.owner_id) {
      res.status(403).json({
        message: "Sorry only the user that created the vacation can do that"
      });
    } else {
      next();
    }
  } catch (err) {
    console.error(err);

    res.status(500).json({ error: "Failed to verify creator of the vacation" });
  }
}
