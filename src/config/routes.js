const express = require('express');
const PostsController = require('../controllers/posts.controllers');
const routes = express.Router();
const UsersController = require('../controllers/users.controller')
const auth  = require('../middlewares/auth')


routes.put('/user',UsersController.create);
routes.post('/user/login',UsersController.login);
routes.post('/user/me',auth,UsersController.me);
routes.get('/user/is-email-unique/:emailVal',UsersController.checkEmail);
routes.get('/user/is-username-unique/:usernameVal',UsersController.checkUsername);


routes.get('/post',auth, PostsController.feed)

module.exports = routes;