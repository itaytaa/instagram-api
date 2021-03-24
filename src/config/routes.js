const express = require('express');
const PostsController = require('../controllers/posts.controllers');
const routes = express.Router();
const UsersController = require('../controllers/users.controller')
const auth = require('../middlewares/auth')
const multer = require('multer');
const upload = multer({ dest: 'public/posts' })
const avatar = multer({ dest: 'public/avatars', limits: { fieldSize: 25 * 1024 * 1024 } },)

routes.put('/user', UsersController.create);
routes.post('/user/edit/:id', auth, avatar.single('image'), UsersController.editUser);
routes.post('/user/login', UsersController.login);
routes.post('/user/me', auth, UsersController.me);
routes.get('/user/is-username-unique/:usernameVal', UsersController.checkUsername);
routes.get('/user/is-email-unique/:emailVal', UsersController.checkEmail);
routes.get('/user/:username/posts', auth, UsersController.Posts);
routes.get('/user/:username', auth, UsersController.getUser);
routes.post('/user/:id/follow', auth, UsersController.follow)
routes.post('/user/:id/unFollow', auth, UsersController.unFollow)
routes.get('/user', auth, UsersController.getAll);



routes.get('/post/:id/comment', auth, PostsController.getComments)
routes.get('/post', auth, PostsController.feed)
routes.put('/post/:id/comment', auth, PostsController.addComment)
routes.delete('/post/:id/delete-comment', auth, PostsController.deleteComment)


routes.post('/comment/:id/like', auth, PostsController.likeComment)
routes.delete('/comment/:id/unLike/:userId', auth, PostsController.unLikeComment)


routes.get('/post/:id', auth, PostsController.getPost)
routes.put('/post', auth, upload.single('image'), PostsController.create)
routes.delete('/post/:id/like/:userId', auth, PostsController.unLike)
routes.post('/post/:id/like', auth, PostsController.like)

routes.get('/', (req, res) => res.send())



module.exports = routes;