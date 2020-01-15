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
const CommentModel = require('../../models/Comment')

describe('# Comment Model', () => {

  before(done => {
    done()
  })

  const Comment = ReplyModel(sequelize, dataTypes)
  const like = new Comment()
  checkModelName(Comment)('Comment')

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
      Comment.associate({ User })
      Comment.associate({ Restaurant })
      Comment.associate({ Attraction })
      Comment.associate({ Tour })
      Comment.associate({ Blog })
    })

    it('should belong to user', (done) => {
      expect(Comment.belongsTo).to.have.been.calledWith(User)
      done()
    })
    it('should belong to restaurant', (done) => {
      expect(Comment.belongsTo).to.have.been.calledWith(Restaurant)
      done()
    })
    it('should belong to attraction', (done) => {
      expect(Comment.belongsTo).to.have.been.calledWith(Attraction)
      done()
    })
    it('should belong to tour', (done) => {
      expect(Comment.belongsTo).to.have.been.calledWith(Tour)
      done()
    })
    it('should belong to tour', (done) => {
      expect(Comment.belongsTo).to.have.been.calledWith(Blog)
      done()
    })
  })

  context('action', () => {

    let data = null

    it('create', (done) => {
      db.Comment.create({}).then((Comment) => {
        data = Comment
        done()
      })
    })
    it('read', (done) => {
      db.Comment.findByPk(data.id).then((Comment) => {
        expect(data.id).to.be.equal(Comment.id)
          done()
        })
    })
    it('update', (done) => {
      db.Comment.update({}, { where: { id: data.id }}).then(() => {
        db.Comment.findByPk(data.id).then((Comment) => {
          expect(data.updatedAt).to.be.not.equal(Comment.updatedAt)
          done()
        })
      })
    })
    it('delete', (done) => {
      db.Comment.destroy({ where: { id: data.id }}).then(() => {
        db.Comment.findByPk(data.id).then((Comment) => {
          expect(Comment).to.be.equal(null)
          done()
        })
      })
    })
  })

})
