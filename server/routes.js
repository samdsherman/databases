var controller = require('./controllers');
var router = require('express').Router();

//Connect controller methods to their corresponding routes
router.get('/messages', controller.messages.get);

router.post('/messages', controller.messages.post);

router.get('/users', controller.users.get);

router.post('/users', controller.users.post);

router.put('/users', controller.users.put);

router.get('/rooms', controller.messages.get);

router.post('/rooms', controller.messages.post);


module.exports = router;

