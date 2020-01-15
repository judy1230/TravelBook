process.env.NODE_ENV = 'test'

var chai = require('chai')
var sinon = require('sinon')
chai.use(require('sinon-chai'))

const { expect } = require('chai')
const {
  sequelize,
  dataTypes,
  checkModelName,
  checkUniqueIndex,
  checkPropertyExists
} = require('sequelize-test-helpers')

const db = require('../../models')
const UserModel = require('../../models/user')

describe('# User Model', () => {
  before(done => {
    done()
  })

  const User = UserModel(sequelize, dataTypes)
  const user = new User()
  checkModelName(User)('User')

  context('properties', () => {
    ;[
      'name', 'email', 'password'
    ].forEach(checkPropertyExists(user))
  })

  context('associations', () => {
    const Comment = 'Comment'
    const Tour = 'Tour'
    const Blog = 'Blog'
    const Like = 'Like'
    const Favorite = 'Favorite'
    const Component = 'Component'
    before(() => {
      User.associate({ Comment })
      User.associate({ Tour })
      User.associate({ Blog })
      User.associate({ Component })
      User.associate({ Favorite })
      User.associate({ Like })
    })

    it('should have many comments', (done) => {
      expect(User.hasMany).to.have.been.calledWith(Comment)
      done()
    })
    it('should have many tours', (done) => {
      expect(User.hasMany).to.have.been.calledWith(Tour)
      done()
    })
    it('should have many likes', (done) => {
      expect(User.hasMany).to.have.been.calledWith(Like)
      done()
    })
    it('should have many blogs', (done) => {
      expect(User.hasMany).to.have.been.calledWith(Blog)
      done()
    })
    it('should have many favorites', (done) => {
      expect(User.belongsToMany).to.have.been.calledWith(Favorite)
      done()
    })
    it('should have many components', (done) => {
      expect(User.belongsToMany).to.have.been.calledWith(Component)
      done()
    })
  })

  context('action', () => {
    let data = null

    it('create', (done) => {
      db.User.create({}).then((user) => {
        data = user
        done()
      })
    })
    it('read', (done) => {
      db.User.findByPk(data.id).then((user) => {
        expect(data.id).to.be.equal(user.id)
        done()
      })
    })
    it('update', (done) => {
      db.User.update({}, { where: { id: data.id } }).then(() => {
        db.User.findByPk(data.id).then((user) => {
          expect(data.updatedAt).to.be.not.equal(user.updatedAt)
          done()
        })
      })
    })
    it('delete', (done) => {
      db.User.destroy({ where: { id: data.id } }).then(() => {
        db.User.findByPk(data.id).then((user) => {
          expect(user).to.be.equal(null)
          done()
        })
      })
    })
  })
})
