const router = require("express").Router();

const dbVacations = require("./vacations-model");
const {
  userIsOwner,
  validateVacation,
  attachVID
} = require("./vacation-middleware");

const activitiesRouter = require("./activities/activities-router");
const placesRouter = require("./places/places-router");
const commentsRouter = require("./comments/comments-router");
const datesRouter = require("./dates/dates-router");
const usersRouter = require("./users/users-router");

router.use("/:vid/places", attachVID, placesRouter);
router.use("/:vid/activities", attachVID, activitiesRouter);
router.use("/:vid/comments", attachVID, commentsRouter);
router.use("/:vid/dates", attachVID, datesRouter);
router.use("/:vid/users", attachVID, usersRouter);

router.get("/:id", async (req, res) => {
  //get stuff
});

router.post("/", validateVacation, async (req, res) => {
  const { name } = req.body;

  try {
    const { id } = req.decodedJwt;
    const vacation = await dbVacations.add({ name, owner_id: id });

    res.status(201).json(vacation);
  } catch (err) {
    console.error(err);

    res.status(500).json({ error: "Failed to create vacation" });
  }
});

router.put("/:vid", userIsOwner, validateVacation, async (req, res) => {
  const { name } = req.body;

  try {
    const vacation = await dbVacations.update({ name }, req.params.vid);

    vacation
      ? res.status(202).json(vacation)
      : res
          .status(404)
          .json({ message: "Vacation with that ID was not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update vacation" });
  }
});

router.delete("/:vid", userIsOwner, async (req, res) => {
  try {
    const deleted = await dbVacations.remove(req.params.vid);

    deleted
      ? res.status(202).json({ message: "Vacation was deleted" })
      : res
          .status(404)
          .json({ message: "Vacation with that ID was not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete vacation" });
  }
});

module.exports = router;
