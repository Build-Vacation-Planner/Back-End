const router = require("express").Router();

const dbVacations = require("./vacations-model");
const dbUsers = require("../users/users-model");
const {
  userIsOwner,
  validateVacation,
  attachVID,
  vacationIdExists
} = require("./vacation-middleware");

const activitiesRouter = require("./activities/activities-router");
const commentsRouter = require("./comments/comments-router");
const datesRouter = require("./dates/dates-router");
const usersRouter = require("./users/users-router");

router.use("/:vid/activities", vacationIdExists, attachVID, activitiesRouter);
router.use("/:vid/comments", vacationIdExists, attachVID, commentsRouter);
router.use("/:vid/dates", vacationIdExists, attachVID, datesRouter);
router.use("/:vid/users", vacationIdExists, attachVID, usersRouter);

/**
 * @api {post} /api/vacations/ Vacations - Add
 * @apiName Add Vacation
 * @apiGroup Vacations
 *
 * @apiParam {String} name Vacation's name, required
 * @apiParam {String} place Destination where vacation will take place, optional
 * @apiParam {String} picture URL string of picture describing the vacation, optional
 * @apiHeader {String} authorization user's access token.
 *
 * @apiExample {js} Example usage
 * axios.post("https://vacation-planner-be.herokuapp.com/api/vacations/", {
 *    name: "Summer Vacation",
 *    place: "Cancun",
 *    picture: "http://lorempixel.com/640/480/city",
 * })
 *
 * @apiSuccess (201) {Array} vacations Array containing vacations with its name, description, place, picture, date object, activities array, comments array and array of user's invited
 *
 * @apiSuccessExample {json} Successful Response
 *
 * "vacations": [
 *   {
 *     "id": 1,
 *     "name": "Summer Vacation",
 *     "description": "Summer getaway to some beach",
 *     "place": "Cancun",
 *     "picture": "http://lorempixel.com/640/480/city",
 *     "dates": null,
 *     "comments": [],
 *     "activities": [],
 *     "users": []
 *   }
 *  ]
 *
 */
router.post("/", validateVacation, async (req, res) => {
  let vacationData = {};

  if (req.body.description)
    vacationData = { ...vacationData, description: req.body.description };
  if (req.body.place) vacationData = { ...vacationData, place: req.body.place };
  if (req.body.picture)
    vacationData = { ...vacationData, picture: req.body.picture };
  if (req.body.name) {
    vacationData = { ...vacationData, name: req.body.name };
  } else {
    res.status(400).json({ message: "Please provide the required field name" });
  }

  try {
    const { id } = req.decodedJwt;
    const vacation = await dbVacations.add({ ...vacationData, owner_id: id });
    const vacationsArr = await dbUsers.getVacationsArr(req.decodedJwt.id);
    res.status(201).json(vacationsArr);
  } catch (err) {
    console.error(err);

    res.status(500).json({ error: "Failed to create vacation" });
  }
});

/**
 * @api {put} /api/vacations/:vid Vacations - Update
 * @apiName Update Vacation
 * @apiGroup Vacations
 *
 * @apiParam {Number} vid Input vacations's id into the URL
 * @apiParam {String} name Vacation's name, required
 * @apiParam {String} place Destination where vacation will take place, optional
 * @apiParam {String} picture URL string of picture describing the vacation, optional
 * @apiHeader {String} authorization user's access token.
 *
 * @apiExample {js} Example usage
 * axios.put("https://vacation-planner-be.herokuapp.com/api/vacations/1", {
 *    name: "Summer Vacation",
 *    place: "Cancun",
 *    picture: "http://lorempixel.com/640/480/city",
 * })
 *
 * @apiSuccess (202) {Array} vacations Array containing vacations with its name, description, place, picture, date object, activities array, comments array and array of user's invited
 *
 * @apiSuccessExample {json} Successful Response
 *
 * "vacations": [
 *   {
 *     "id": 1,
 *     "name": "Summer Vacation",
 *     "description": "Summer getaway to some beach",
 *     "place": "Cancun",
 *     "picture": "http://lorempixel.com/640/480/city",
 *     "dates": null,
 *     "comments": [],
 *     "activities": [],
 *     "users": []
 *   }
 *  ]
 *
 */
router.put("/:vid", vacationIdExists, userIsOwner, async (req, res) => {
  let changes = {};

  if (req.body.description)
    changes = { ...changes, description: req.body.description };
  if (req.body.place) changes = { ...changes, place: req.body.place };
  if (req.body.picture) changes = { ...changes, picture: req.body.picture };
  if (req.body.name) changes = { ...changes, name: req.body.name };

  if (Object.getOwnPropertyNames(changes).length == 0) {
    res.status(400).json({
      message: "Please provide name, description, place or picture URL"
    });
  }

  try {
    const vacation = await dbVacations.update(changes, req.params.vid);
    const vacationsArr = await dbUsers.getVacationsArr(req.decodedJwt.id);
    vacation
      ? res.status(202).json(vacationsArr)
      : res
          .status(404)
          .json({ message: "Vacation with that ID was not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update vacation" });
  }
});

/**
 * @api {delete} /api/vacations/:vid Vacations - Delete
 * @apiName Delete Vacation
 * @apiGroup Vacations
 *
 * @apiParam {Number} vid Input vacations's id into the URL
 * @apiHeader {String} authorization user's access token.
 *
 * @apiExample {js} Example usage
 * axios.delete("https://vacation-planner-be.herokuapp.com/api/vacations/1")
 *
 * @apiSuccess (202) {Array} vacations Array containing vacations with its name, description, place, picture, date object, activities array, comments array and array of user's invited
 *
 * @apiSuccessExample {json} Successful Response
 *
 * "vacations": [
 *   {
 *     "id": 1,
 *     "name": "Summer Vacation",
 *     "description": "Summer getaway to some beach",
 *     "place": "Cancun",
 *     "picture": "http://lorempixel.com/640/480/city",
 *     "dates": null,
 *     "comments": [],
 *     "activities": [],
 *     "users": []
 *   }
 *  ]
 *
 */
router.delete("/:vid", vacationIdExists, userIsOwner, async (req, res) => {
  try {
    const deleted = await dbVacations.remove(req.params.vid);
    const vacationsArr = await dbUsers.getVacationsArr(req.decodedJwt.id);

    deleted
      ? res.status(202).json(vacationsArr)
      : res
          .status(404)
          .json({ message: "Vacation with that ID was not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete vacation" });
  }
});

module.exports = router;
