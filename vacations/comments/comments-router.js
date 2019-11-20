const router = require("express").Router();

const dbComments = require("./comments-model");
const dbUsers = require("../../users/users-model");

/**
 * @api {post} /api/vacations/:vid/comments/ Comments - Add
 * @apiName Add Comment to the Vacation
 * @apiGroup Vacations
 *
 * @apiParam {Number} vid Input vacations's id into the URL
 * @apiParam {String} body Comment's text, required
 * @apiHeader {String} authorization user's access token.
 *
 * @apiExample {js} Example usage
 * axios.post("https://vacation-planner-be.herokuapp.com/api/vacations/2/comments/", {
 *    body: "Body of comment goes here"
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
router.post("/", async (req, res) => {
  const { body } = req.body;

  try {
    const comment = await dbComments.add({
      body,
      created_by: req.decodedJwt.id,
      vacation_id: req.vid
    });
    const vacationsArr = await dbUsers.getVacationsArr(req.decodedJwt.id);

    res.status(201).json(vacationsArr);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send the comment" });
  }
});

/**
 * @api {put} /api/vacations/:vid/comments/:id Comments - Update
 * @apiName Update Comment on Vacation
 * @apiGroup Vacations
 *
 * @apiParam {Number} vid Input vacations's id into the URL
 * @apiParam {Number} id Input comment's id into the URL
 * @apiParam {String} body Comment's text, required
 * @apiHeader {String} authorization user's access token.
 *
 * @apiExample {js} Example usage
 * axios.put("https://vacation-planner-be.herokuapp.com/api/vacations/2/comments/1", {
 *    body: "Body of comment goes here"
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
router.put("/:id", async (req, res) => {
  const { title, body } = req.body; //conditional check name & description

  try {
    const comment = await dbComments.update({ title, body }, req.params.id);
    const vacationsArr = await dbUsers.getVacationsArr(req.decodedJwt.id);
    comment
      ? res.status(202).json(vacationsArr)
      : res.status(404).json({ message: "Comment with that ID was not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update the comment" });
  }
});

/**
 * @api {delete} /api/vacations/:vid/comments/:id Comments - Delete
 * @apiName Delete Comments from a Vacation
 * @apiGroup Vacations
 *
 * @apiParam {Number} vid Input vacations's id into the URL
 * @apiParam {Number} id Input comment's id into the URL
 * @apiHeader {String} authorization user's access token.
 *
 * @apiExample {js} Example usage
 * axios.delete("https://vacation-planner-be.herokuapp.com/api/vacations/2/comments/1")
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
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await dbComments.remove(req.params.id);
    const vacationsArr = await dbUsers.getVacationsArr(req.decodedJwt.id);

    deleted
      ? res.status(202).json(vacationsArr)
      : res.status(404).json({ message: "Comment with that ID was not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

module.exports = router;
