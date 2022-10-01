const db = require("./db");

module.exports = userController = {
  getUsers: () => db.User.aggregate([
    {
      $sort: { creationDate: -1 }
    },
    {
      $limit: 150 // only show (or compare) the newest 150 users
    },
    {
      $project: {name: 1, xbox: 1, ps: 1, note: 1, answers: 1} // only show these non-sensitive fields
    }
  ]),

  checkEmailAvailability: async (email) => {
    const existingUser = await db.User.findOne({ email: email });
    if (existingUser) {
      return false;
    } else {
      return true;
    }
  },

  addUser: (user) => db.User.create(user),
};
