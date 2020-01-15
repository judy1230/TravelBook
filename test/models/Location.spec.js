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
const LocationModel = require('../../models/location')

describe('# Location Model', () => {

  before(done => {
    done()
  })

  const Location = LocationModel(sequelize, dataTypes)
  const location = new Location()
  checkModelName(Location)('location')

  context('properties', () => {
    ;[
    ].forEach(checkPropertyExists(location))
  })

  context('associations', () => {
    const Restaurant = 'Restaurant'
    const Attraction = 'Attraction'
    const Tour = 'Tour'
    const Blog = 'Blog'
    before(() => {
      Location.associate({ Restaurant })
      Location.associate({ Attraction })
      Location.associate({ Tour })
      Location.associate({ Blog })
    })


    it('should have many restaurants', (done) => {
      expect(Location.hasMany).to.have.been.calledWith(Restaurant)
      done()
    })
    it('should have many attractions', (done) => {
      expect(Location.hasMany).to.have.been.calledWith(Attraction)
      done()
    })
    it('should have many tours', (done) => {
      expect(Location.hasMany).to.have.been.calledWith(Tour)
      done()
    })
    it('should have many blogs', (done) => {
      expect(Location.hasMany).to.have.been.calledWith(Blog)
      done()
    })
  })

  context('action', () => {

    let data = null

    it('create', (done) => {
      db.Location.create({}).then((Location) => {
        data = Location
        console.log('Location',Location)
        done()
      })
    })
    it('read', (done) => {
      console.log('Location', data)
        db.Location.findByPk(data.id).then((Location) => {
          expect(data.id).to.be.equal(Location.id)
          done()
        })
    })
    it('update', (done) => {
      db.Location.update({}, { where: { id: data.id }}).then(() => {
        db.Location.findByPk(data.id).then((Location) => {
          expect(data.updatedAt).to.be.not.equal(Location.updatedAt)
          done()
        })
      })
    })
    it('delete', (done) => {
      db.Location.destroy({ where: { id: data.id }}).then(() => {
        db.Location.findByPk(data.id).then((Location) => {
          expect(Location).to.be.equal(null)
          done()
        })
      })
    })
  })

})
