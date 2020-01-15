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
const ComponentModel = require('../../models/component')

describe('# Component Model', () => {

  before(done => {
    done()
  })

  const Component = ComponentModel(sequelize, dataTypes)
  const component = new component()
  checkModelName(Component)('Component')

  context('properties', () => {
    ;[
    ].forEach(checkPropertyExists(Component))
  })

  context('associations', () => {
    const User = 'User'
    const Restaurant = 'Restaurant'
    const Attraction = 'Attraction'
    before(() => {
      Component.associate({ User })
      Component.associate({ Restaurant })
      Component.associate({ Attraction })
    })

    it('should belong to user', (done) => {
      expect(Component.belongsTo).to.have.been.calledWith(User)
      done()
    })
    it('should belong to restaurant', (done) => {
      expect(Component.belongsTo).to.have.been.calledWith(Restaurant)
      done()
    })
    it('should belong to attraction', (done) => {
      expect(Component.belongsTo).to.have.been.calledWith(Attraction)
      done()
    })
  })

  context('action', () => {

    let data = null

    it('create', (done) => {
      db.Component.create({}).then((Component) => {
        data = Component
        console.log('Component',Component)
        done()
      })
    })
    it('read', (done) => {
      console.log('Component', data)
        db.Component.findByPk(data.id).then((Component) => {
          expect(data.id).to.be.equal(Component.id)
          done()
        })
    })
    it('update', (done) => {
      db.Component.update({}, { where: { id: data.id }}).then(() => {
        db.Component.findByPk(data.id).then((Component) => {
          expect(data.updatedAt).to.be.not.equal(Component.updatedAt)
          done()
        })
      })
    })
    it('delete', (done) => {
      db.Component.destroy({ where: { id: data.id }}).then(() => {
        db.Component.findByPk(data.id).then((Component) => {
          expect(Component).to.be.equal(null)
          done()
        })
      })
    })
  })

})
