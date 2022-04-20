const router = require("express").Router();

const loginCheck = () => {
  return (req, res, next) => {
    // check for a logged in user
    if (req.session.user) {
      // if the user is logged in they can proceed as requested
      next()
    } else {
      res.redirect('/login')
    }
  }
};

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/welcome', (req,res, next) => {
  const loggedInUser = req.session.user
  res.render('welcome', {user: loggedInUser})
})

router.get('/main', loginCheck(), (req, res, next) => {
  const loggedInUser = req.session.user
  res.render('main', {user: loggedInUser})
});

router.get('/private', loginCheck(), (req, res, next) => {
  res.render('private')
});

module.exports = router;
