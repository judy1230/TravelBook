'use strict';
const bcrypt = require('bcrypt-nodejs')
const faker = require('faker')

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
      Array.from({ length: 10 }).map(d =>
        ({
          name: faker.name.findName(),
          phone: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          opening_hours: '08:00',
          image: faker.image.imageUrl(),
          introduction: faker.lorem.text(),
          LocationId: Math.floor(Math.random() * 5) + 1,
          favoritedCount: Math.floor(Math.random() * 20) + 1,
          likedCount: Math.floor(Math.random() * 20) + 1,
          componentCount: Math.floor(Math.random() * 20) + 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      ), {});
    queryInterface.bulkInsert('Attractions',
      Array.from({ length: 10 }).map(d =>
        ({
          name: faker.name.findName(),
          phone: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          opening_hours: '08:00',
          image: faker.image.imageUrl(),
          introduction: faker.lorem.text(),
          LocationId: Math.floor(Math.random() * 5) + 1,
          favoritedCount: Math.floor(Math.random() * 20) + 1,
          likedCount: Math.floor(Math.random() * 20) + 1,
          componentCount: Math.floor(Math.random() * 20) + 1,
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
          favoritedCount: Math.floor(Math.random() * 20) + 1,
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
          favoritedCount: Math.floor(Math.random() * 20) + 1,
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
          TourId: Math.floor(Math.random() * 3) + 1,
          BlogId: Math.floor(Math.random() * 3) + 1,
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
          TourId: Math.floor(Math.random() * 3) + 1,
          BlogId: Math.floor(Math.random() * 3) + 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      ), {});
    // return queryInterface.bulkInsert('Components',
    //   Array.from({ length: 3 }).map(d =>
    //     ({
    //       UserId: Math.floor(Math.random() * 3) + 1,
    //       RestaurantId: Math.floor(Math.random() * 10) + 1,
    //       AttractionId: Math.floor(Math.random() * 10) + 1,
    //       Lat: 25.0478142,
    //       Lng: 121.5169488,
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     })
    //   ), {});
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Users', null, {});
    queryInterface.bulkDelete('Restaurants', null, {});
    queryInterface.bulkDelete('Attractions', null, {});
    queryInterface.bulkDelete('Locations', null, {});
    queryInterface.bulkDelete('Tours', null, {});
    queryInterface.bulkDelete('Blogs', null, {});
    queryInterface.bulkDelete('Comment', null, {});
    queryInterface.bulkDelete('Favorites', null, {});
    return queryInterface.bulkDelete('Likes', null, {});
    //return queryInterface.bulkDelete('Components', null, {});
  }
};


