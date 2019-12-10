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
		res.render('/admin/admin')
	},
	getAdminChart: (req, res) => {
		res.render('/admin/admin chart')
	}

}
module.exports = adminController
