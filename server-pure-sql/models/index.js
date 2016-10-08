var db = require('../db');
var mysql = require('mysql');
var Promise = require('bluebird');

module.exports = {
  messages: {
    get: function (req, res) {
      // return table with every message
        // relate the user_id to the user.name
        // relate the room_id to the room.name
      db.query('SELECT m.id, m.text, u.username, r.roomname FROM messages m INNER JOIN rooms r ON (r.id=m.room_id) INNER JOIN users u ON (u.id=m.user_id)'
        , [], function(err, results) {
          res.end(JSON.stringify(results));
        });
    }, // a function which handles a get request for all messages
    post: function (req, res) {
      var userSelectQuery = 'SELECT id FROM users WHERE username="' + req.body.username + '"';
      var roomSelectQuery = 'SELECT id FROM rooms WHERE roomname="' + req.body.roomname + '"';

      var userId;
      var roomId;

      new Promise(function (resolve, reject) {
        db.query(userSelectQuery, function (err, results) {
          resolve(results);
        });
      })
      .then(function (results) {
        return new Promise(function (resolve, reject) {
          if (results[0]) {
            userId = results[0].id;
            resolve(userId);
          } else {
            db.query('INSERT INTO users (username) VALUES ("' + req.body.username + '")', [], function (err, results) {
              userId = results.insertId;
              resolve(userId);
            });
          }
        });
      })
      .then(function () {
        return new Promise(function (resolve, reject) {
          db.query(roomSelectQuery, [], function (err, results) {
            resolve(results);
          });
        });
      })
      .then(function (results) {
        return new Promise(function (resolve, reject) {
          if (results[0]) {
            roomId = results[0].id;
            resolve(roomId);
          } else {
            db.query('INSERT INTO rooms (roomname) VALUES ("' + req.body.roomname + '")', [], function (err, results) {
              roomId = results.insertId;
              resolve(roomId);
            });
          }
        });
      })
      .then(function () {
        var messageInsertQuery = 'INSERT INTO messages (text, user_id, room_id) VALUES ("' + 
          req.body.text + '", ' + userId + ', ' + roomId + ')';
        return new Promise(function (resolve, reject) {
          db.query(messageInsertQuery, [], function (err, results) {
            resolve(results);
          });
        });
      })
      .then(function (results) {
        res.end();
      })
      .catch(function (err) {
        console.error(err);
        // TODO: send code 500
        res.end();
      });

    } // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function (req, res) {
      db.query('SELECT name FROM users', [], function (err, results) {
        res.end(JSON.stringify(results));
      });
    },
    post: function (req, res) {
      // TODO: check for the user before INSERTing
      db.query('INSERT INTO users (username) VALUES ("' + req.body.username + '")', [], function(err, results) {
        res.end();
      });
    }
  },

  rooms: {
    get: function (req, res) {
      db.query('SELECT name FROM rooms', [], function (err, results) {
        res.end(JSON.stringify(results));
      });
    },
    post: function (req, res) {
      // TODO: check for the room before INSERTing
      db.query('INSERT INTO rooms (roomname) VALUES ("' + req.body.roomname + '")', [], function(err, results) {
        res.end();
      });
    },
  }

};

