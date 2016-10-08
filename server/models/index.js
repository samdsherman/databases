var db = require('../db');
var mysql = require('mysql');
var Promise = require('bluebird');
var Sequelize = require('sequelize');

var sequelize = new Sequelize('chat', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

var User = sequelize.define('user', {
  username: {
    type: Sequelize.STRING
  }
}, {
  timestamps: false
});

var Room = sequelize.define('room', {
  roomname: {
    type: Sequelize.STRING
  }
}, {
  timestamps: false
});

var Message = sequelize.define('message', {
  userId: {
    type: Sequelize.INTEGER,
    field: 'user_id'
  },
  roomId: {
    type: Sequelize.INTEGER,
    field: 'user_id'
  },
  text: {
    type: Sequelize.STRING
  }
}, {
  timestamps: false
});

// Set up relationships
User.hasMany(Message, {foreignKey: 'user_id'});
Message.belongsTo(User, {foreignKey: 'user_id'});
Room.hasMany(Message, {foreignKey: 'room_id'});
Message.belongsTo(Room, {foreignKey: 'room_id'});


module.exports = {
  messages: {
    get: function (req, res) {
      sequelize.sync()
        .then(function () {
          return Message.findAll({include: [
            {
              model: User,
              required: true
            },
            {
              model: Room,
              required: true
            }
          ]});
        })
        .then(function (messages) {
          return messages.map(function (message) {
            return {
              text: message.dataValues.text,
              username: message.dataValues.user.dataValues.username,
              roomname: message.dataValues.room.dataValues.roomname
            };
          });
        })
        .then(function (messages) {
          res.send(JSON.stringify(messages));
        });
    }, // a function which handles a get request for all messages
    post: function (req, res) {

      var userId;
      var roomId;

      sequelize.sync()
        .then(function () {
          return User.findOrCreate({where: {username: req.body.username}});
        })
        .then(function (user) {
          userId = user[0].dataValues.id;

          return Room.findOrCreate({where: {roomname: req.body.roomname}});
        })
        .then(function (room) {
          roomId = room[0].dataValues.id;

          return Message.create({
            text: req.body.text,
            userId: userId,
            roomId: roomId
          });
        })
        .then(function (message) {
          res.end();
        });
    } // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function (req, res) {

      sequelize.sync()
        .then(function () {
          return User.findAll({
            attributes: ['username']
          });
        })
        .then(function (users) {
          return users.map(function (user) {
            return user.dataValues.username;
          });
        })
        .then(function (users) {
          res.end(JSON.stringify(users));
        });
    },
    post: function (req, res) {

      sequelize.sync()
        .then(function() {
          return User.findOrCreate({where: {'username': req.body.username} });
        })
        .then(function(user) {
          res.end();
        });
    }
  },

  rooms: {
    get: function (req, res) {

      sequelize.sync()
        .then(function () {
          return Room.findAll({
            attributes: ['roomname']
          });
        })
        .then(function (rooms) {
          return rooms.map(function (room) {
            return room.dataValues.roomname;
          });
        })
        .then(function (rooms) {
          res.end(JSON.stringify(rooms));
        });
    },
    post: function (req, res) {
      sequelize.sync()
        .then(function() {
          return Room.findOrCreate({where: {'roomname': req.body.roomname} });
        })
        .then(function(room) {
          res.end();
        });
    },
  }

};

