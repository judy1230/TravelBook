'use strict';
const bcrypt = require('bcrypt-nodejs')
const faker = require('faker')
const attractions = require('../seeders/attraction_temp.json')
const restaurants = require('../seeders/restaurant_temp.json')
const shops = require('../seeders/Shopping_temp.json')
const photos = require('../seeders/photos.json')
module.exports = {

  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('Users', [{
      email: 'root@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: "root",
      avatar: faker.image.imageUrl(),
      introduction: faker.lorem.text(),
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      email: 'user1@example.com',
      password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
      name: "user1",
      avatar: faker.image.imageUrl(),
      introduction: faker.lorem.text(),
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});

    queryInterface.bulkInsert('Locations',
      Array.from({ length: 5 }).map(d =>
        ({
          name: faker.name.findName(),
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      ), {});
    queryInterface.bulkInsert('Restaurants',
      restaurants.map((item) =>
        ({
          category:'restaurant',
          name: item.name,
          phone: item.phone,
          address: item.address,
          opening_hours: item.opening_hours,
          opening_up: item.opening_up,
          opening_down: item.opening_down,
          image: item.image,
          introduction: item.introduction,
          stayTime: 90,
          rating: ((Math.random() * 1) + (Math.floor(Math.random() * 4) + 1)).toFixed(1),
          Location: 'taipei',
          viewCounts: Math.floor(Math.random() * 20) + 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      ), {});
    queryInterface.bulkInsert('Attractions',
      attractions.map((item) =>
      ({
        category: 'attraction',
        name: item.name,
        phone: item.phone,
        address: item.address,
        opening_hours: item.opening_hours,
        image: item.image,
        introduction: item.introduction,
        stayTime: 90,
        rating: ((Math.random() * 1) + (Math.floor(Math.random() * 4) + 1)).toFixed(1),
        Location: 'taipei',
        viewCounts: Math.floor(Math.random() * 20) + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      ), {});
    queryInterface.bulkInsert('Shops',
      shops.map((item) =>
        ({
          category:'shop',
          name: item.name,
          phone: item.phone,
          address: item.address,
          opening_hours: item.opening_hours,
          opening_up: item.opening_up,
          opening_down: item.opening_down,
          image: item.image,
          introduction: item.introduction,
          stayTime: 90,
          rating: ((Math.random() * 1) + (Math.floor(Math.random() * 4)+1)).toFixed(1),
          Location: 'taipei',
          viewCounts: Math.floor(Math.random() * 20) + 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      ), {});
    queryInterface.bulkInsert('Photos',
      photos.map((item) =>
        ({
          restaurantId: item.restId,
          attractionId: item.attractionId,
          shopId: item.shopId,
          image: item.image,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      ), {});
    queryInterface.bulkInsert('Tours',
      Array.from({ length: 3 }).map(d =>
        ({
          title: faker.name.findName(),
          image: faker.image.imageUrl(),
          UserId: Math.floor(Math.random() * 2) + 1,
          LocationId: Math.floor(Math.random() * 5) + 1,
          description: faker.lorem.text(),
          days: Math.floor(Math.random() * 2) + 1,
          tag: faker.name.findName(),
          likedCount: Math.floor(Math.random() * 20) + 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      ), {});
    queryInterface.bulkInsert('Blogs',
      Array.from({ length: 3 }).map(d =>
        ({
          title: faker.name.findName(),
          image: faker.image.imageUrl(),
          UserId: Math.floor(Math.random() * 2) + 1,
          LocationId: Math.floor(Math.random() * 5) + 1,
          TourId: Math.floor(Math.random() * 3) + 1,
          content: faker.lorem.text(),
          tag: faker.name.findName(),
          likedCount: Math.floor(Math.random() * 20) + 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      ), {});
    queryInterface.bulkInsert('Comments',
      Array.from({ length: 5 }).map(d =>
        ({
          UserId: Math.floor(Math.random() * 3) + 1,
          comment: faker.lorem.text(),
          RestaurantId: Math.floor(Math.random() * 10) + 1,
          TourId: Math.floor(Math.random() * 3) + 1,
          BlogId: Math.floor(Math.random() * 3) + 1,
          AttractionId: Math.floor(Math.random() * 10) + 1,
          ShopId: Math.floor(Math.random() * 10) + 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      ), {});
      queryInterface.bulkInsert('Favorites',
      Array.from({ length: 3 }).map(d =>
        ({
          UserId: Math.floor(Math.random() * 3) + 1,
          RestaurantId: Math.floor(Math.random() * 10) + 1,
          AttractionId: Math.floor(Math.random() * 10) + 1,
          ShopId: Math.floor(Math.random() * 10) + 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        ), {});
    return queryInterface.bulkInsert('Likes',
      Array.from({ length: 3 }).map(d =>
        ({
          UserId: Math.floor(Math.random() * 3) + 1,
          RestaurantId: Math.floor(Math.random() * 10) + 1,
          AttractionId: Math.floor(Math.random() * 10) + 1,
          ShopId: Math.floor(Math.random() * 10) + 1,
          TourId: Math.floor(Math.random() * 3) + 1,
          BlogId: Math.floor(Math.random() * 3) + 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      ), {});

  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Users', null, {});
    queryInterface.bulkDelete('Restaurants', null, {});
    queryInterface.bulkDelete('Attractions', null, {});
    queryInterface.bulkDelete('Shops', null, {});
    queryInterface.bulkDelete('Locations', null, {});
    queryInterface.bulkDelete('Tours', null, {});
    queryInterface.bulkDelete('Blogs', null, {});
    queryInterface.bulkDelete('Comment', null, {});
    queryInterface.bulkDelete('Favorites', null, {});
    return queryInterface.bulkDelete('Likes', null, {});
    //return queryInterface.bulkDelete('Components', null, {});
  }
};


