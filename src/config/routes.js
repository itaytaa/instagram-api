const express = require('express');
const PostsController = require('../controllers/posts.controllers');
const routes = express.Router();
const UsersController = require('../controllers/users.controller')
const auth  = require('../middlewares/auth')
const multer = require('multer');
const upload = multer({dest: 'public/posts'})

routes.put('/user',UsersController.create);
routes.post('/user/login',UsersController.login);
routes.post('/user/me',auth,UsersController.me);
routes.get('/user/is-email-unique/:emailVal',UsersController.checkEmail);
routes.get('/user/is-username-unique/:usernameVal',UsersController.checkUsername);
routes.get('/user/:username/posts',auth,UsersController.Posts);
routes.get('/user/:username',UsersController.getUser);


routes.get('/post',auth, PostsController.feed)
routes.get('/post/:id',auth, PostsController.getPost)
routes.put('/post',auth,upload.single('image'),PostsController.create)

module.exports = routes;