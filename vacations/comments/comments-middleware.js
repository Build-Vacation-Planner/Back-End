const dbVacations = require("../vacations-model");
const dbComments = require("./comments-model");

module.exports = { canModifyComment, commentIdExists };

async function canModifyComment(req, res, next) {
  try {
    const vacation = await dbVacations.getBy({ id: req.vid });
    const comment = await dbComments.getBy({ id: req.params.id });
    if (
      req.decodedJwt.id != vacation.owner_id &&
      req.decodedJwt.id != comment.created_by
    ) {
      res.status(403).json({
        message:
          "Sorry only the admin of the vacation or user that created the comment can modify it"
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

async function commentIdExists(req, res, next) {
  try {
    const comment = await dbComments.getBy({ id: req.params.id });

    comment
      ? next()
      : res.status(404).json({ message: "Comment with that ID doesn't exist" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Failed to verify if the ID of the comment" });
  }
}
