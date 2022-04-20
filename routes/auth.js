const router = require("express").Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User')

router.get('/signup', (req, res, next) => {
    res.render('signup.hbs')
})

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body
    // some validations for the username
    if (username.length === 0) {
        res.render('signup.hbs', {message: 'username is required'})
        return
    }
    // some validation for the password
    if (password.length < 4 ) {
        res.render('signup', {message: 'password must have at least 4 characters'})
        return
    }
    // all validation criteria is met -> check if the user already is in the db
    User.findOne({username: username})
    .then( userFromDB => {
        if(userFromDB !== null) {
            res.render('signup.hbs', {message: 'this username is taken already.'})
            return
        }
        // if I reach here, the user name is valid, signup should be completed
        // first create hash for the password
        const salt = bcrypt.genSaltSync()
		const hash = bcrypt.hashSync(password, salt)
        // second add data base entry using username and hashed password
        User.create({
            username: username,
            password: hash
        })
        .then( createdUser => {
            console.log(createdUser)
            // render a welcome page for him / her
            res.redirect('welcome')
        })
        .catch(err => {next(err)})
    }
    )
    .catch(err => {next(err)})
})

router.get('/login', (req, res, next) => {
    res.render('login')
})

router.post('/login', (req, res, next) => {
    
    const { username, password } = req.body
    User.findOne({username: username})
    .then( userFromDB => {
        // does the user exits?
        if(userFromDB === null) {
            res.render('login', {message: 'your credentials are not valid.'})
        }
        // does the password match?
        if(bcrypt.compareSync(password, userFromDB.password)) {
            // initiate session
            req.session.user = userFromDB
            // show welcome page
            res.redirect('welcome')
        }
        else {
            res.render('login', {message: 'your credentials are not valid.'})
        }
    })
    .catch(err => {next(err)})
})

router.get('/logout', (req, res, next) => {
	req.session.destroy((err => {
		if(err) {
			next(err)
		} else {
			// success - we don't have an error
			res.redirect('/login')
		}
	}))
});

module.exports = router;