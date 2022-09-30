const db = require("./db");

module.exports = userController = {
  getUsers: () => db.User.find({})
    .sort({ creationDate: -1 })
    .limit(150), // only show (or compare) the newest 150 users

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
