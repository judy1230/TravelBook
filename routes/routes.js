const express = require('express');
const router = express.Router();
const toursController = require('../controllers/toursController.js')
//const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
const calculate = require('../controllers/calculate.js')
const passport = require('../config/passport')
const geolocation = require('../config/geolocation')
//const helpersreq = require('../_helpers')

const authenticated = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next()
	}
	res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
	if (req.isAuthenticated()) {
		if (req.user.role ==='admin') { return next() }
		return res.redirect('/')
	}
	res.redirect('/signin')
}
//index
router.get('/', (req, res) => res.redirect('/index'))
router.get('/index', toursController.getIndex)
//temp tour
router.post('/users/:id/tour', authenticated, geolocation.getCurrentPosition, userController.postTour)
router.put('/users/:id/dailyTour/', authenticated, calculate.duration, userController.getDailyTour)
router.get('/users/:tour_id/dailyTour', authenticated, geolocation.getCurrentPosition, calculate.duration, geolocation.getWeather, userController.getDailyTour)
//store to db tour
router.get('/users/:id/tour/:tour_id', authenticated, userController.getUserDailyTour)
router.get('/users/:id/tour/:tour_id/edit', authenticated, userController.getUserDailyTourEdit)
router.put('/users/:id/tour/:tour_id/edit', authenticated, userController.putUserDailyTourEdit, calculate.putTour)
router.delete('/users/:id/tour/:tour_id', authenticated, userController.deleteUserDailyTour)
//user favorite control
router.get('/users/:id/favorite', authenticated, geolocation.getCurrentPosition,userController.getFavorites)
router.post('/restaurants/:rest_id/favorite', authenticated, userController.addFavoriteRest)
router.delete('/restaurants/:rest_id/favorite', authenticated, userController.removeFavoriteRest)
router.post('/attractions/:attraction_id/favorite', authenticated, userController.addFavoriteAttraction)
router.delete('/attractions/:attraction_id/favorite', authenticated, userController.removeFavoriteAttraction)
router.post('/shops/:shop_id/favorite', authenticated, userController.addFavoriteShop)
router.delete('/shops/:shop_id/favorite', authenticated, userController.removeFavoriteShop)
//user component control
router.post('/users/:rest_id/restaurant/component', authenticated,userController.addRestComponent)
router.delete('/users/:rest_id/restaurant/component', authenticated, userController.removeRestComponent)
router.put('/users/:rest_id/restaurant/component', authenticated, userController.putRestComponent)
router.post('/users/:attraction_id/attraction/component', authenticated,userController.addAttractionComponent)
router.delete('/users/:attraction_id/attraction/component', authenticated, userController.removeAttractionComponent)
router.put('/users/:attraction_id/attraction/component', authenticated, userController.putAttractionComponent)
router.post('/users/:shop_id/shop/component', authenticated, userController.addShopComponent)
router.delete('/users/:shop_id/shop/component', authenticated, userController.removeShopComponent)
router.put('/users/:shop_id/shop/component', authenticated, userController.putShopComponent)
router.delete('/components/removeAllComponents', authenticated, userController.removeAllComponents)
//user comment control
router.post('/restaurant/:rest_id/comment', authenticated, userController.postRestComment)
router.post('/attraction/:attraction_id/comment', authenticated, userController.postAttractionComment)
router.post('/shop/:shop_id/comment', authenticated, userController.postShopComment)
router.delete('/comment/:comment_id', authenticatedAdmin, userController.removeComment)

//restaurant, attraction,  display,
router.get('/restaurants', toursController.getRestaurants)
router.get('/attractions', toursController.getAttractions)
router.get('/shops', toursController.getShops)
router.get('/restaurants/:restaurant_id', toursController.getRestaurant)
router.get('/attractions/:attraction_id', toursController.getAttraction)
router.get('/shops/:shop_id', toursController.getShop)
//tour control
//router.get('/users/:tour_id/daysTour', userController.getDaysTour)
//router.get('/users/:tour_id/blogEdit', userController.getBlogEdit)
//router.post('/users/:tour_id/blogEdit', userController.postBlog)
//router.get('/users/blog/:id', userController.getBlog)
//router.get('/dailyTours', toursController.getDailyTours)
//router.get('/daysTours', toursController.getDaysTours)
//router.get('/blog/:tour_id', toursController.getBlogs)

//SHARE
//router.get('/users/:id/tour/:tour_id/share', authenticated, userController.getShare)
//router.post('/users/:id/share', userController.getShare)

//admin controller
//router.get('/admin', adminController.getAdmin)
//router.get('/admin/chart', adminController.getAdminChart)

//user profile
router.get('/users/:id/profile', authenticated, userController.getProfile)
//router.post('/users/:id/profile', userController.postProfile)

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
