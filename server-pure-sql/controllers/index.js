var models = require('../models');

module.exports = {
  messages: {
    get: function (req, res) { models.messages.get(req, res); }, // a function which produces all the messages
    post: function (req, res) { models.messages.post(req, res); } // a function which can be used to insert a message into the database
  },

  users: {
    get: function (req, res) { models.users.get(req, res); },
    post: function (req, res) { models.users.post(req, res); }
  },

  rooms: {
    get: function (req, res) { models.rooms.get(req, res); },
    post: function (req, res) { models.rooms.post(req, res); }
  }
};

