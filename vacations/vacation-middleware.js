const { body, validationResult } = require("express-validator");

const dbVacations = require("./vacations-model");

module.exports = { userIsOwner, validateVacation, attachVID, vacationIdExists };

async function userIsOwner(req, res, next) {
  try {
    const vacation = await dbVacations.getBy({ id: req.params.vid });
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

async function validateVacation(req, res, next) {
  try {
    await body("name")
      .exists()
      .withMessage("Name field is required")
      .bail()
      .not()
      .isEmpty()
      .withMessage("Name cannot be empty")
      .run(req);

    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to validate vacation" });
  }
}

function attachVID(req, res, next) {
  req.vid = req.params.vid;
  next();
}

async function vacationIdExists(req, res, next) {
  try {
    const vacation = await dbVacations.getBy({ id: req.params.vid });

    vacation
      ? next()
      : res
          .status(400)
          .json({ message: "Vacation with that ID doesn't exist" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to verify vacation ID" });
  }
}
