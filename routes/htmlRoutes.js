const userController = require("../db/controllers");

module.exports = function(app) {
  app.get("/users", async (req, res) => {
    const users = await userController.getUsers();
    res.json(users);
  });
};
