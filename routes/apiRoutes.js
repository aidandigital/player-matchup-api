const userController = require("../db/controllers");
const sanitize = require("../sanitize");

module.exports = function (app) {
  app.post("/survey", async function (req, res) {
    const { answers, info } = req.body;
    // Answer (survey responses) Validation
    const answerRgx = /([^1-5])/;
    const emailRgx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let answersValid = true;
    answers.forEach((answer, i) => {
      if (answer.length !== 1 || answerRgx.test(answer)) {
        answersValid = false;
      }
    });
    // Info (profile) Sanitation
    let [name, xbox, ps, note, add, email] = [
      sanitize(info.name),
      sanitize(info.xbox),
      sanitize(info.ps),
      sanitize(info.note),
      sanitize(info.add),
      sanitize(info.email),
    ];
    // "add" = wether user chose to their info to public list of gamers (true or false)
    if (
      !answersValid ||
      answers.length !== 10 ||
      (add != "0" && name == "") ||
      (add != "0" && xbox == "" && ps == "" && note == "") ||
      (add != "0" && !emailRgx.test(email))
    ) {
      // Invalid data
      // we don't need semantic error messages since we already have that in frontend validation
      // any invalid data we catch on the backend will not be accidental (user is cheating)
      res.json({
        success: false,
        msg: "Could not process invalid request",
      });
    } else {
      // Valid data:
      // Get a match
      let winnerIndex;
      let winnerTotalDif = 40; // Starts at max possible difference

      const usersSample = await userController.getUsers();

      usersSample.forEach((user, i) => {
        let totalDif = 0;
        user.answers.forEach((answer, x) => {
          totalDif += Math.abs(answer - answers[x]);
        });
        if (totalDif < winnerTotalDif) {
          winnerIndex = i;
          winnerTotalDif = totalDif;
        }
      });
      const match = usersSample[winnerIndex];
      // Check email
      let addMsg = "";
      // If user chose to add their info to the public list of gamers:
      if (add != "0") {
        // Check email availability
        const emailAvailable = await userController.checkEmailAvailability(email);

        if (!emailAvailable) {
          addMsg =
            "We couldn't add you to the public list of gamers because that email address is already in use.";
        } else {
          // Add to gamers list (do last so you don't match with yourself)
          await userController.addUser({
            answers: answers,
            name: name,
            xbox: xbox,
            ps: ps,
            note: note,
            email: email,
            ip: req.requestIP,
          });
        }
      }
      // Send back info about the match
      res.json({
        success: true,
        addMsg: addMsg,
        name: match.name,
        xbox: match.xbox,
        ps: match.ps,
        note: match.note,
      });
    }
  });
};
