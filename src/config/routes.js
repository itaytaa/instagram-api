const express = require('express')
const routes = express.Router();
const UsersController = require('../controllers/users.controller')

routes.put('/user',UsersController.create);
routes.post('/user/login',UsersController.login);
routes.post('/user/me',UsersController.me);
routes.get('/user/is-email-unique/:emailVal',UsersController.checkEmail);
routes.get('/user/is-username-unique/:usernameVal',UsersController.checkUsername);




module.exports = routes;