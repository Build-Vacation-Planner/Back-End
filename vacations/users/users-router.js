const router = require("express").Router();

const dbUsers = require("./users-model");
const dbGetData = require("../../users/users-model");
const dbUserVacations = require("./user-vacations-model");

const { userIsOwner } = require("./users-middleware");

/**
 * @api {post} /api/vacations/:vid/users/ Users - Add
 * @apiName Add User's to the Vacation
 * @apiGroup Vacations
 *
 * @apiParam {Number} vid Input vacations's id into the URL
 * @apiParam {String} username User's username, required
 * @apiHeader {String} authorization user's access token.
 *
 * @apiExample {js} Example usage
 * axios.post("https://vacation-planner-be.herokuapp.com/api/vacations/2/users/", {
 *    username: "Billy"
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
router.post("/", userIsOwner, async (req, res) => {
  const { username } = req.body;

  try {
    const user = await dbUsers.getBy({ username });

    if (user) {
      const userExistsInVacation = await dbUserVacations.getBy({
        user_id: user.id,
        vacation_id: req.vid
      });

      if (userExistsInVacation) {
        res
          .status(400)
          .json({ message: "User is already apart of the vacation" });
      } else {
        const added = dbUserVacations.add({
          user_id: user.id,
          vacation_id: req.vid
        });
        const vacationsArr = await dbGetData.getVacationsArr(req.decodedJwt.id);

        added
          ? res.status(201).json(vacationsArr)
          : res
              .status(500)
              .json({ error: "Failed to add user to the vacation" });
      }
    } else {
      res
        .status(404)
        .json({ message: "User with that username doesn't exist" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add user to the vacation" });
  }
});

/**
 * @api {delete} /api/vacations/:vid/users/:id Users - Delete
 * @apiName Delete User's from the Vacation
 * @apiGroup Vacations
 *
 * @apiParam {Number} vid Input vacations's id into the URL
 * @apiParam {Number} id Input user's id into the URL
 * @apiHeader {String} authorization user's access token.
 *
 * @apiExample {js} Example usage
 * axios.delete("https://vacation-planner-be.herokuapp.com/api/vacations/2/users/1")
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
router.delete("/:id", userIsOwner, async (req, res) => {
  try {
    const user = await dbUsers.getBy({ id: req.params.id });

    if (user) {
      const userExistsInVacation = await dbUserVacations.getBy({
        user_id: user.id,
        vacation_id: req.vid
      });

      if (userExistsInVacation) {
        const deleted = dbUserVacations.remove({
          user_id: user.id,
          vacation_id: req.vid
        });
        const vacationsArr = await dbGetData.getVacationsArr(req.decodedJwt.id);

        deleted
          ? res.status(202).json(vacationsArr)
          : res
              .status(500)
              .json({ error: "Failed to remove user from the vacation" });
      } else {
        res
          .status(400)
          .json({ message: "That user isn't apart of the vacation" });
      }
    } else {
      res.status(404).json({ message: "User with that ID doesn't exist" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to remove user from the vacation" });
  }
});

module.exports = router;
