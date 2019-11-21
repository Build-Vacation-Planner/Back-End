const router = require("express").Router();

const dbDates = require("./dates-model");
const dbUsers = require("../../users/users-model");
const {
  uniqueEntry,
  canModifyDates,
  datesIdExists
} = require("./dates-middleware");

/**
 * @api {post} /api/vacations/:vid/dates/ Dates - Add
 * @apiName Add Vacation's Date
 * @apiGroup Vacations
 *
 * @apiParam {Number} vid Input vacations's id into the URL
 * @apiParam {date} start Vacation's start date, optional
 * @apiParam {date} end Vacation's end date, optional
 * @apiHeader {String} authorization user's access token.
 *
 * @apiExample {js} Example usage
 * axios.post("https://vacation-planner-be.herokuapp.com/api/vacations/2/dates/", {
 *    start: "2020-03-08",
 *    end: "2020-03-15"
 * })
 *
 * @apiSuccess (201) {Array} vacations Array containing vacations with its name, description, place, picture, date object, activities array, comments array and array of user's invited
 *
 * @apiSuccessExample {json} Successful Response
 *
 * "vacations": [
 *   {
 *     "name": "Summer Vaction",
 *     "description": "Summer getaway to some beach",
 *     "place": "Cancun",
 *     "picture": "http://lorempixel.com/640/480/city",
 *     "dates": {
 *       "id": 3,
 *       "start": "1999-01-08T06:00:00.000Z",
 *       "end": "1999-01-08T06:00:00.000Z"
 *     },
 *     "comments": [
 *       {
 *         "id": 7,
 *         "body": "Cancun here we go",
 *         "created_by": 1
 *       },
 *       {
 *         "id": 8,
 *         "body": "OMG so pumped for cancun",
 *         "created_by": 4
 *       }
 *     ],
 *     "activities": [
 *       {
 *         "id": 7,
 *         "name": "Xcaret",
 *         "description": "Wild life tour"
 *       }
 *     ],
 *     "users": [
 *       {
 *         "id": 2,
 *         "username": "Adriel",
 *         "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/jomarmen/128.jpg"
 *       },
 *       {
 *         "id": 4,
 *         "username": "Monte",
 *         "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/turkutuuli/128.jpg"
 *       }
 *     ]
 *   },
 *
 */

router.post("/", canModifyDates, uniqueEntry, async (req, res) => {
  let datesData = {};

  if (req.body.start) datesData = { ...datesData, start: req.body.start };
  if (req.body.end) datesData = { ...datesData, end: req.body.start };

  try {
    const dates = await dbDates.add({ ...datesData, vacation_id: req.vid });
    const vacationsArr = await dbUsers.getVacationsArr(req.decodedJwt.id);

    res.status(201).json(vacationsArr);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add the dates" });
  }
});

/**
 * @api {put} /api/vacations/:vid/dates/:id Dates - Update
 * @apiName Update Vacation's Date
 * @apiGroup Vacations
 *
 * @apiParam {Number} vid Input vacations's id into the URL
 * @apiParam {Number} id Input date's id into the URL
 * @apiParam {date} start Vacation's start date, optional
 * @apiParam {date} end Vacation's end date, optional
 * @apiHeader {String} authorization user's access token.
 *
 * @apiExample {js} Example usage
 * axios.put("https://vacation-planner-be.herokuapp.com/api/vacations/2/dates/1", {
 *    start: "2020-03-08",
 *    end: "2020-03-15"
 * })
 *
 * @apiSuccess (202) {Array} vacations Array containing vacations with its name, description, place, picture, date object, activities array, comments array and array of user's invited
 *
 * @apiSuccessExample {json} Successful Response
 *
 * "vacations": [
 *   {
 *     "name": "Summer Vaction",
 *     "description": "Summer getaway to some beach",
 *     "place": "Cancun",
 *     "picture": "http://lorempixel.com/640/480/city",
 *     "dates": {
 *       "id": 3,
 *       "start": "1999-01-08T06:00:00.000Z",
 *       "end": "1999-01-08T06:00:00.000Z"
 *     },
 *     "comments": [
 *       {
 *         "id": 7,
 *         "body": "Cancun here we go",
 *         "created_by": 1
 *       },
 *       {
 *         "id": 8,
 *         "body": "OMG so pumped for cancun",
 *         "created_by": 4
 *       }
 *     ],
 *     "activities": [
 *       {
 *         "id": 7,
 *         "name": "Xcaret",
 *         "description": "Wild life tour"
 *       }
 *     ],
 *     "users": [
 *       {
 *         "id": 2,
 *         "username": "Adriel",
 *         "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/jomarmen/128.jpg"
 *       },
 *       {
 *         "id": 4,
 *         "username": "Monte",
 *         "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/turkutuuli/128.jpg"
 *       }
 *     ]
 *   },
 *
 */
router.put("/:id", datesIdExists, canModifyDates, async (req, res) => {
  let changes = {};

  if (req.body.start) changes = { ...changes, start: req.body.start };
  if (req.body.end) changes = { ...changes, end: req.body.start };

  if (Object.getOwnPropertyNames(changes) == 0) {
    res.status(400).json({ message: "Please provide start or end date field" });
  }
  try {
    const dates = await dbDates.update({ ...changes }, req.params.id);
    const vacationsArr = await dbUsers.getVacationsArr(req.decodedJwt.id);
    dates
      ? res.status(202).json(vacationsArr)
      : res.status(404).json({ message: "Dates with that ID was not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update the dates" });
  }
});

/**
 * @api {delete} /api/vacations/:vid/dates/:id Dates - Delete
 * @apiName Delete Vacation's Date
 * @apiGroup Vacations
 *
 * @apiParam {Number} vid Input vacations's id into the URL
 * @apiParam {Number} id Input date's id into the URL
 * @apiHeader {String} authorization user's access token.
 *
 * @apiExample {js} Example usage
 * axios.delete("https://vacation-planner-be.herokuapp.com/api/vacations/2/dates/1")
 *
 * @apiSuccess (202) {Array} vacations Array containing vacations with its name, description, place, picture, date object, activities array, comments array and array of user's invited
 *
 * @apiSuccessExample {json} Successful Response
 *
 * "vacations": [
 *   {
 *     "name": "Summer Vaction",
 *     "description": "Summer getaway to some beach",
 *     "place": "Cancun",
 *     "picture": "http://lorempixel.com/640/480/city",
 *     "dates": {
 *       "id": 3,
 *       "start": "1999-01-08T06:00:00.000Z",
 *       "end": "1999-01-08T06:00:00.000Z"
 *     },
 *     "comments": [
 *       {
 *         "id": 7,
 *         "body": "Cancun here we go",
 *         "created_by": 1
 *       },
 *       {
 *         "id": 8,
 *         "body": "OMG so pumped for cancun",
 *         "created_by": 4
 *       }
 *     ],
 *     "activities": [
 *       {
 *         "id": 7,
 *         "name": "Xcaret",
 *         "description": "Wild life tour"
 *       }
 *     ],
 *     "users": [
 *       {
 *         "id": 2,
 *         "username": "Adriel",
 *         "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/jomarmen/128.jpg"
 *       },
 *       {
 *         "id": 4,
 *         "username": "Monte",
 *         "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/turkutuuli/128.jpg"
 *       }
 *     ]
 *   },
 *
 */
router.delete("/:id", datesIdExists, canModifyDates, async (req, res) => {
  try {
    const deleted = await dbDates.remove(req.params.id);

    deleted
      ? res.status(202).json({ message: "Dates were deleted" })
      : res.status(404).json({ message: "Dates with that ID was not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete the dates" });
  }
});

module.exports = router;
