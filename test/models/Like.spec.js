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
const LikeModel = require('../../models/like')

describe('# Like Model', () => {

  before(done => {
    done()
  })

  const Like = LikeModel(sequelize, dataTypes)
  const like = new Like()
  checkModelName(Like)('Like')

  context('properties', () => {
    ;[
    ].forEach(checkPropertyExists(like))
  })

  context('associations', () => {
    const User = 'User'
    const Restaurant = 'Restaurant'
    const Attraction = 'Attraction'
    const Tour = 'Tour'
    const Blog = 'Blog'
    before(() => {
      Like.associate({ User })
      Like.associate({ Restaurant })
      Like.associate({ Attraction })
      Like.associate({ Tour })
      Like.associate({ Blog })
    })

    it('should belong to user', (done) => {
      expect(Like.belongsTo).to.have.been.calledWith(User)
      done()
    })
    it('should belong to restaurant', (done) => {
      expect(Like.belongsTo).to.have.been.calledWith(Restaurant)
      done()
    })
    it('should belong to attraction', (done) => {
      expect(Like.belongsTo).to.have.been.calledWith(Attraction)
      done()
    })
    it('should belong to tour', (done) => {
      expect(Like.belongsTo).to.have.been.calledWith(Tour)
      done()
    })
    it('should belong to blog', (done) => {
      expect(Like.belongsTo).to.have.been.calledWith(Blog)
      done()
    })
  })

  context('action', () => {

    let data = null

    it('create', (done) => {
      db.Like.create({}).then((like) => {
        data = like
        console.log('like',like)
        done()
      })
    })
    it('read', (done) => {
      console.log('like', data)
        db.Like.findByPk(data.id).then((like) => {
          expect(data.id).to.be.equal(like.id)
          done()
        })
    })
    it('update', (done) => {
      db.Like.update({}, { where: { id: data.id }}).then(() => {
        db.Like.findByPk(data.id).then((like) => {
          expect(data.updatedAt).to.be.not.equal(like.updatedAt)
          done()
        })
      })
    })
    it('delete', (done) => {
      db.Like.destroy({ where: { id: data.id }}).then(() => {
        db.Like.findByPk(data.id).then((like) => {
          expect(like).to.be.equal(null)
          done()
        })
      })
    })
  })

})
