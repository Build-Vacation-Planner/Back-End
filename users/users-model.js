const db = require("../data/dbConfig");

module.exports = {
  getUserVacationsIds,
  getComments,
  getActivities,
  getUsersInVacations,
  getAllForUser
};

async function getUserVacationsIds(uid) {
  const vacations = await db("users as u")
    .select("v.id")
    .leftJoin("user_vacations as uv", "uv.user_id", "u.id")
    .leftJoin("vacations as v", "v.id", "uv.vacation_id")
    .where("u.id", uid);

  const ids = vacations.map(vacation => {
    return vacation.id;
  }, []);

  return ids;
}

async function getUsersInVacations(vid, uid) {
  return await db("users as u")
    .select("u.username", "u.id", "u.avatar")
    .join("user_vacations as uv", "uv.user_id", "u.id")
    .where("uv.vacation_id", vid)
    .whereNotIn("u.id", [uid]);
}

async function getDates(vid) {
  return db("dates as d")
    .select("d.start", "d.end")
    .join("vacations as v", "v.id", "d.vacation_id")
    .where("v.id", vid)
    .first();
}

async function getComments(vid) {
  return await db("comments as c")
    .select("c.body", "c.id")
    .innerJoin("vacations as v", "v.id", "c.vacation_id")
    .where("c.vacation_id", vid);
}

async function getActivities(vid) {
  return await db("activities as a")
    .select("a.name", "a.description")
    .innerJoin("vacations as v", "v.id", "a.vacation_id")
    .where("a.vacation_id", vid);
}

async function getVacations(vid) {
  return await db("vacations")
    .select("name", "description")
    .where("id", vid)
    .first();
}

async function getAllForUser(uid) {
  const user = await db("users")
    .select("id", "username", "avatar")
    .where({ id: uid })
    .first();

  const vacationsIds = await getUserVacationsIds(uid);

  const vacationsArr = await Promise.all(
    vacationsIds.map(async vid => {
      const vacation = await getVacations(vid);
      const dates = await getDates(vid);
      const comments = await getComments(vid);
      const activities = await getActivities(vid);
      const users = await getUsersInVacations(vid, uid);

      if (vacation) {
        return {
          name: vacation.name,
          description: vacation.description,
          place: vacation.place,
          picture: vacation.picture,
          dates,
          comments,
          activities,
          users
        };
      } else {
        return;
      }
    })
  );

  if (vacationsArr[0] == null) {
    return { ...user, vacations: [] };
  } else {
    return { ...user, vacations: vacationsArr };
  }
}
