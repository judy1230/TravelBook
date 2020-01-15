//process.env.NODE_ENV = 'test'

var chai = require('chai');
var sinon = require('sinon');
chai.use(require('sinon-chai'));

const { expect } = require('chai')
const {
  sequelize,
  dataTypes,
  checkModelName,
  checkUniqueIndex,
  checkPropertyExists
} = require('sequelize-test-helpers')

const db = require('../../models')
const RestaurantModel = require('../../models/restaurant')

describe('# Restaurant Model', () => {

  before(done => {
    done()

  })

  const Restaurant = RestaurantModel(sequelize, dataTypes)
  const restaurant = new restaurant()
  checkModelName(Restaurant)('Restaurant')

  context('properties', () => {
    ;[
    ].forEach(checkPropertyExists(restaurant))
  })

  context('associations', () => {
    const Comment = 'Comment'
    const Component = 'Component'
    const Like = 'Like'
    const Favorite = 'Favorite'
    const Location = 'Location'
    const User = 'User'
    before(() => {
      Restaurant.associate({ Comment })
      Restaurant.associate({ Component })
      Restaurant.associate({ Like })
      Restaurant.associate({ Favorite })
      Restaurant.associate({ Location })
      Restaurant.associate({ User })
    })

    it('should have many comments', (done) => {
      expect(Restaurant.hasMany).to.have.been.calledWith(Comment)
      done()
    })
    it('should have many components', (done) => {
      expect(Restaurant.hasMany).to.have.been.calledWith(Component)
      done()
    })
    it('should have many favorites', (done) => {
      expect(Restaurant.hasMany).to.have.been.calledWith(Favorite)
      done()
    })
    it('should have many liks', (done) => {
      expect(Restaurant.hasMany).to.have.been.calledWith(Like)
      done()
    })
    it('should belong to user', (done) => {
      expect(Restaurant.belongsTo).to.have.been.calledWith(User)
      done()
    })
    it('should belong to locations', (done) => {
      expect(Restaurant.belongsTo).to.have.been.calledWith(Location)
      done()
    })
  })

  context('action', () => {

    let data = null

    it('create', (done) => {
      db.restaurant.create({UserId: 1, description: 'hi'}).then((restaurant) => {
        data = restaurant
        done()
      })
    })
    it('read', (done) => {
      db.restaurant.findByPk(data.id).then((restaurant) => {
        expect(data.id).to.be.equal(restaurant.id)
          done()
        })
    })
    it('update', (done) => {
      db.restaurant.update({}, { where: { id: data.id }}).then(() => {
        db.restaurant.findByPk(data.id).then((restaurant) => {
          expect(data.updatedAt).to.be.not.equal(restaurant.updatedAt)
          done()
        })
      })
    })
    it('delete', (done) => {
      db.restaurant.destroy({ where: { id: data.id }}).then(() => {
        db.restaurant.findByPk(data.id).then((restaurant) => {
          expect(restaurant).to.be.equal(null)
          done()
        })
      })
    })
  })

})
