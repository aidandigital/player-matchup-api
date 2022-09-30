const userController = require("../db/controllers");

// DEPENDENCIES
const path = require("path");

module.exports = function(app) {
  app.get("/survey", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/survey.html"));
  });

  app.get("/users", async (req, res) => {
    const users = await userController.getUsers();
    res.json(users);
  })

  // Anything else goes to the home page:
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/home.html"))
  });
};
