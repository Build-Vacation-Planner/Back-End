const router = require("express").Router();

const dbUsers = require("./users-model");
const dbUserVacations = require("./user-vacations-model");

const { userIsOwner } = require("./users-middleware");

router.post("/", userIsOwner, async (req, res) => {
  const { username } = req.body;

  try {
    const user = await dbUsers.getBy({ username });
    console.log(user);

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

        added
          ? res.status(201).json({ message: "User was added" })
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

router.delete("/:id", userIsOwner, async (req, res) => {
  //delete username with id
  //const { username } = req.body;

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

        deleted
          ? res.status(202).json({ message: "User was removed" })
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
