const express = require('express');
const router = express.Router();

const toursController = require('../controllers/toursController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
// const multer = require('multer')
// const upload = multer({ dest: 'temp/' })
const passport = require('../config/passport')
const helpersreq = require('../_helpers')

const authenticated = (req, res, next) => {
	console.log(req.user)
	if (helpersreq.ensureAuthenticated(req)) {
		return next()
	}
	res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
	if (helpersreq.ensureAuthenticated(req)) {
		if (helpersreq.getUser(req).role ==='admin') { return next() }
		return res.redirect('/')
	}
	res.redirect('/signin')
}
//index
router.get('/', (req, res) => res.redirect('/tours'))
router.get('/tours', toursController.getTours)
router.get('/users/:id/tourEdit', userController.tourEdit)
router.post('/users/:id/tourEdit', userController.postTour)
router.get('/users/:id/favorite', userController.getFavorite)
router.post('/users/:rest_id/restaurant/component', userController.addRestComponent)
router.delete('/users/:rest_id/restaurant/component', userController.removeRestComponent)
router.post('/users/:attraction_id/attraction/component', userController.addAttractionComponent)
router.delete('/users/:attraction_id/attraction/component', userController.removeAttractionComponent)
router.get('/users/:tour_id/dailyTour', userController.getDailyTour)
//router.get('/users/:tour_id/daysTour', userController.getDaysTour)
//router.get('/users/:tour_id/blogEdit', userController.getBlogEdit)
//router.post('/users/:tour_id/blogEdit', userController.postBlog)
//router.get('/users/blog/:id', userController.getBlog)
//router.get('/users/:id/profile', userController.getProfile)
//router.post('/users/:id/profile', userController.postProfile)
//restaurant, attraction, tour, blog display,
router.get('/restaurants', toursController.getRestaurants)
router.get('/attractions', toursController.getAttractions)
router.get('/shops', toursController.getShops)
router.get('/dailyTours', toursController.getDailyTours)
router.get('/daysTours', toursController.getDaysTours)
//router.get('/blog/:tour_id', toursController.getBlogs)
router.get('/restaurants/:restaurant_id', toursController.getRestaurant)
router.get('/attractions/:attraction_id', toursController.getAttraction)
router.get('/shops/:shop_id', toursController.getShop)
//router.post('/favorite/:restaurant_id', toursController.addFavoriteRest)
//router.post('/favorite/:attraction_id', toursController.addFavoriteAttraction)
//router.post('/favorite/:shopping_id', toursController.addFavoriteShopping)
router.get('/dailyTours/:tour_id', toursController.getDailyTour)
router.get('/daysTours/:tour_id', toursController.getDaysTour)
//router.get('/blog/:tour_id', toursController.getBlog)

//SHARE
//router.get('/users/:id/share', userController.getShare)
//router.post('/users/:id/share', userController.getShare)

//admin controller
//router.get('/admin', adminController.getAdmin)
//router.get('/admin/chart', adminController.getAdminChart)

// //users sign up
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
// //users sing in
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', {
	failureRedirect: '/signin',
	failureFlash: true
}), userController.signIn)
//users logout
router.get('/logout', userController.logout)

module.exports = router
