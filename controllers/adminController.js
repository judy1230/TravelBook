const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const Attraction = db.Attraction
const Tour = db.Tour
const Blog = db.Blog
const Favorite = db.Favorite
const Like = db.Like
const Comment = db.Comment
const Location = db.Location
//const imgur = require('imgur-node-api')
//const IMGUR_CLIENT_ID = '158d5ec5eff6842'
//const fs = require('fs')
const helpersreq = require('../_helpers')


const adminController = {
	getAdmin: (req, res) => {
		res.render('admin/admin')
	},
	getAdminChart: (req, res) => {
		res.render('/admin/admin chart')
	},
	// createRestaurant: (req, res) => {
	// 	return Restaurant.create({
	// 		UserId: req.user.id,
	// 		category:'Restaurant',
	// 		name: req.params.name,
	// 		phone: res.params.phone,
	// 		opening_hours: res.params.opening_hours,
	// 		address: res.params.address,
	// 		image: res.params.image,
	// 		introduction: res.params.introduction,
	// 		Location: res.params.Location,
	// 		stayTime: res.params.stayTime,
	// 		rating: res.params.rating
	// 	}).then((component) => {
	// 		return res.redirect('back')
	// 	})
	//},

}
module.exports = adminController
