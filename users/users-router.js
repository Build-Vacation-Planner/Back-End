const router = require("express").Router();
const bcrypt = require("bcryptjs");

const dbUsers = require("./users-model");

/**
 * @api {get} /api/users/ User - Get
 * @apiName Get User Logged In Info
 * @apiGroup Users
 *
 * @apiHeader {String} authorization user's access token.
 *
 * @apiExample {js} Example usage
 * axios.get("https://vacation-planner-be.herokuapp.com/api/users/")
 *
 * @apiSuccess (200) {Object} User Object containing user's info and vacations arraywith its name, description, place, picture, date object, activities array, comments array and array of user's invited
 *
 * @apiSuccessExample {json} Successful Response
 *
 * {
 * "id": 6,
 * "username": "Sylvester",
 * "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/oscarowusu/128.jpg",
 * "vacations": [
 *   {
 *     "id": 2,
 *     "name": "Christmas Vacation",
 *     "description": "Something that describes this vacation",
 *     "place": null,
 *     "picture": "http://lorempixel.com/640/480/city",
 *     "dates": {
 *       "id": 2,
 *       "start": "2019-12-20T06:00:00.000Z",
 *       "end": "2019-12-27T06:00:00.000Z"
 *     },
 *     "comments": [
 *       {
 *         "id": 4,
 *         "body": "Suggest places to travel",
 *         "created_by": 1
 *       },
 *       {
 *         "id": 5,
 *         "body": "Las Vegas for xmas?",
 *         "created_by": 6
 *       },
 *       {
 *         "id": 6,
 *         "body": "weird place but ok",
 *         "created_by": 3
 *       }
 *     ],
 *     "activities": [
 *       {
 *         "id": 4,
 *         "name": "Sskiing",
 *         "description": null
 *       },
 *       {
 *         "id": 5,
 *         "name": "Gambling",
 *         "description": null
 *       },
 *       {
 *         "id": 6,
 *         "name": "Clubbing",
 *         "description": null
 *       }
 *     ],
 *     "users": [
 *       {
 *         "id": 3,
 *         "username": "Janice",
 *         "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/privetwagner/128.jpg"
 *       },
 *       {
 *         "id": 1,
 *         "username": "Rey",
 *         "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/greenbes/128.jpg"
 *       }
 *     ]
 *   }
 * ]
 *}
 *
 */
router.get("/", async (req, res) => {
  try {
    const result = await dbUsers.getAllForUser(req.decodedJwt.id);

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retreive user's info" });
  }
});

/**
 * @api {put} /api/users/ User - Update
 * @apiName Update User Logged In Info
 * @apiGroup Users
 *
 * @apiParam {String} username Change user's username, optional
 * @apiParam {String} password Change user's password, optional
 * @apiParam {String} avatar Change user's avatar URL, optional
 * @apiHeader {String} authorization user's access token.
 *
 * @apiExample {js} Example usage
 * axios.put("https://vacation-planner-be.herokuapp.com/api/users/")
 *
 * @apiSuccess (202) {Object} User Object containing user's info and vacations arraywith its name, description, place, picture, date object, activities array, comments array and array of user's invited
 *
 * @apiSuccessExample {json} Successful Response
 *
 * {
 * "id": 6,
 * "username": "Sylvester",
 * "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/oscarowusu/128.jpg",
 * "vacations": [
 *   {
 *     "id": 2,
 *     "name": "Christmas Vacation",
 *     "description": "Something that describes this vacation",
 *     "place": null,
 *     "picture": "http://lorempixel.com/640/480/city",
 *     "dates": {
 *       "id": 2,
 *       "start": "2019-12-20T06:00:00.000Z",
 *       "end": "2019-12-27T06:00:00.000Z"
 *     },
 *     "comments": [
 *       {
 *         "id": 4,
 *         "body": "Suggest places to travel",
 *         "created_by": 1
 *       },
 *       {
 *         "id": 5,
 *         "body": "Las Vegas for xmas?",
 *         "created_by": 6
 *       },
 *       {
 *         "id": 6,
 *         "body": "weird place but ok",
 *         "created_by": 3
 *       }
 *     ],
 *     "activities": [
 *       {
 *         "id": 4,
 *         "name": "Sskiing",
 *         "description": null
 *       },
 *       {
 *         "id": 5,
 *         "name": "Gambling",
 *         "description": null
 *       },
 *       {
 *         "id": 6,
 *         "name": "Clubbing",
 *         "description": null
 *       }
 *     ],
 *     "users": [
 *       {
 *         "id": 3,
 *         "username": "Janice",
 *         "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/privetwagner/128.jpg"
 *       },
 *       {
 *         "id": 1,
 *         "username": "Rey",
 *         "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/greenbes/128.jpg"
 *       }
 *     ]
 *   }
 * ]
 *}
 *
 */
router.put("/", async (req, res) => {
  let changes = {};

  if (req.body.username) {
    changes = { ...changes, username: req.body.username };
  }

  if (req.body.avatar) {
    changes = { ...changes, avatar: req.body.avatar };
  }

  if (req.body.password) {
    changes = { ...changes, password: bcrypt.hashSync(req.body.password, 12) };
  }

  try {
    const result = dbUsers.update(changes, req.decodedJwt.id);

    res.status(202).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update user's info" });
  }
});

//create friendlist

module.exports = router;
