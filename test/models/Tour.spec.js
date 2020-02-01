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
const TourModel = require('../../models/tour')

describe('# Tour Model', () => {

  before(done => {
    done()

  })

  const Tour = TourModel(sequelize, dataTypes)
  const tour = new Tour()
  checkModelName(Tour)('Tour')

  context('properties', () => {
    ;[
    ].forEach(checkPropertyExists(tour))
  })

  context('associations', () => {
    const Comment = 'Comment'
    //const Like = 'Like'
    const Favorite = 'Favorite'
    //const Location = 'Location'
    const User = 'User'
    before(() => {
      //Tour.associate({ Comment })
      //Tour.associate({ Like })
      //Tour.associate({ Favorite })
      //Tour.associate({ Location })
      Tour.associate({ User })
    })

    // it('should have many comments', (done) => {
    //   expect(Tour.hasMany).to.have.been.calledWith(Comment)
    //   done()
    // })
    // it('should have many favorites', (done) => {
    //   expect(Tour.hasMany).to.have.been.calledWith(Favorite)
    //   done()
    // })
    // it('should have many liks', (done) => {
    //   expect(Tour.hasMany).to.have.been.calledWith(Like)
    //   done()
    // })
    it('should belong to user', (done) => {
      expect(Tour.belongsTo).to.have.been.calledWith(User)
      done()
    })
    // it('should belong to locations', (done) => {
    //   expect(Tour.belongsTo).to.have.been.calledWith(Location)
    //   done()
    // })
  })

  context('action', () => {

    let data = null

    it('create', (done) => {
      db.Tour.create({UserId: 1, title: 'test'}).then((tour) => {
        data = tour
        done()
      })
    })
    it('read', (done) => {
      db.Tour.findByPk(data.id).then((tour) => {
        expect(data.id).to.be.equal(tour.id)
          done()
        })
    })
    it('update', (done) => {
      db.Tour.update({}, { where: { id: data.id }}).then(() => {
        db.Tour.findByPk(data.id).then((tour) => {
          expect(data.updatedAt).to.be.not.equal(tour.updatedAt)
          done()
        })
      })
    })
    it('delete', (done) => {
      db.Tour.destroy({ where: { id: data.id }}).then(() => {
        db.Tour.findByPk(data.id).then((tour) => {
          expect(tour).to.be.equal(null)
          done()
        })
      })
    })
  })

})
