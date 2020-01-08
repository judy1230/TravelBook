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
	//console.log(req.user)
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
router.get('/', (req, res) => res.redirect('/tours'))
router.get('/tours',  toursController.getTours)

router.get('/users/:id/tourEdit', authenticated, userController.tourEdit)
//router.post('/users/:id/tourEdit', authenticated, userController.postTour)

router.get('/users/:id/favorite', authenticated,userController.getFavorites)
router.post('/restaurant/:rest_id/component', authenticated,userController.addRestComponent)
router.delete('/users/:rest_id/restaurant/component', authenticated, userController.removeRestComponent)
router.put('/users/:rest_id/restaurant/component', authenticated, userController.putRestComponent)
router.post('/users/:attraction_id/attraction/component', authenticated,userController.addAttractionComponent)
router.delete('/users/:attraction_id/attraction/component', authenticated, userController.removeAttractionComponent)
router.put('/users/:attraction_id/attraction/component', authenticated, userController.putAttractionComponent)
router.post('/users/:shop_id/shop/component', authenticated, userController.addShopComponent)
router.delete('/users/:shop_id/shop/component', authenticated, userController.removeShopComponent)
router.put('/users/:shop_id/shop/component', authenticated, userController.putShopComponent)
router.get('/users/:tour_id/dailyTour', authenticated, userController.getDailyTour)
router.put('/users/:id/dailyTour/', authenticated, userController.putTour)
router.post('/restaurant/:rest_id/comment', authenticated, userController.postRestComment)
router.delete('/comment/:comment_id', authenticatedAdmin, userController.removeRestComment)
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
//router.get('/dailyTours', toursController.getDailyTours)
//router.get('/daysTours', toursController.getDaysTours)
//router.get('/blog/:tour_id', toursController.getBlogs)
router.get('/restaurants/:restaurant_id', toursController.getRestaurant)
router.get('/attractions/:attraction_id', toursController.getAttraction)
router.get('/shops/:shop_id', toursController.getShop)
router.post('/restaurants/:rest_id/favorite', authenticated, toursController.addFavoriteRest)
router.delete('/restaurants/:rest_id/favorite', authenticated, toursController.removeFavoriteRest)

router.post('/attractions/:attraction_id/favorite', authenticated,toursController.addFavoriteAttraction)
router.delete('/attractions/:attraction_id/favorite', authenticated, toursController.removeFavoriteAttraction)

router.post('/shops/:shop_id/favorite', authenticated, toursController.addFavoriteShop)
router.delete('/shops/:shop_id/favorite', authenticated, toursController.removeFavoriteShop)

//router.get('/dailyTours/:tour_id', toursController.getDailyTour)
//router.get('/daysTours/:tour_id', toursController.getDaysTour)
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
