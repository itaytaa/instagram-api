
const User = require('../models/user')
const Post = require('../models/post')
const md5 = require('md5')
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/environment/index');
const fs = require('fs').promises;




class UsersController {
    static async create(req, res) {
        try {
            req.body.password = md5(req.body.password);
            const user = new User(req.body);
            const newUser = await user.save()
            res.status(201).send(newUser)
        } catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    }


    static async login(req, res) {
        try {
            const user = await User.findOne({
                username: req.body.username,
                password: md5(req.body.password)
            })

            if (!user) {
                res.sendStatus(401);
                return;
            }
            const payload = {
                _id: user._id,
                username: user.username
            };
            const token = jwt.sign(payload, jwtSecret)
            res.send({
                token: token
            });
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        };
    }

    static async me(req, res) {
        const user = await User.findById(req.user._id)
        res.send(user)
    }


    static async checkEmail(req, res) {
        try {
            const user = await User.findOne({
                email: req.params.emailVal
            })
            if (user) {
                res.send(false)
                return;
            }
            res.send(true);
        } catch (err) {
            res.sendStatus(500)
        }
    }

    static async checkUsername(req, res) {
        try {
            const user = await User.findOne({
                username: req.params.usernameVal
            })
            if (user) {
                res.send(false)
                return;
            }
            res.send(true);
        } catch (err) {
            res.sendStatus(500)
        }

    }


    static async Posts(req, res) {
        try {
            const user = await User.findOne({
                username: req.params.username
            })
            if (!user) {
                res.sendStatus(404)
                return
            }

            const posts = await Post.find({
                user: user._id
            }).sort({ createdAt: req.query.sort || -1 })
                .populate('user', ['username', 'avatar'])

            res.json(posts)
        } catch (err) {
            console.log(err)
            res.sendStatus(500)
        }

    }

    static async getUser(req, res) {
        try {
            const user = await User.findOne({
                username: req.params.username
            })
            if (!user) {
                res.sendStatus(404)
                return
            }
            const { _id, username, avatar, bio, followers } = user
            res.json({ _id, username, avatar, bio, followers })
        } catch (err) {
            console.log(err)
            res.sendStatus(500)
        }

    }
    static async getAll(req, res) {
        console.log(req.query)
        const { username } = req.query;
        try {
            const users = await User.find({
                username: new RegExp(username, 'i')
            })  ///i = insensetive

            res.json(users.map(user => (
                {
                    _id: user._id,
                    username: user.username,
                    createdAt: user.createdAt,
                    avatar: user.avatar,
                    bio: user.bio
                })));
        } catch (err) {
            console.log(err)
            res.sendStatus(500)
        }

    }


    static async editUser(req, res) {
        const { id } = req.params;
        const toUpdate = {}
        if (req.file) {
            const fileName = req.file.filename;
            const imageBase64 = await fs.readFile('public/avatars/' + fileName, {
                encoding: 'base64'
            });
            toUpdate.avatar = imageBase64;
        }
        toUpdate.username = req.body.username;
        toUpdate.email = req.body.email;
        toUpdate.bio = req.body.bio;
        const newUser = await User.findByIdAndUpdate(id, toUpdate, { new: true })
        res.send(newUser)
    }

    static async follow(req, res) {
        try {
            const { id } = req.params;
            const followerUserId = req.user._id;
            if (id === followerUserId) {
                res.sendStatus(400)
                return
            }
            console.log(id)
            const user = await User.findByIdAndUpdate(id, { $addToSet: { followers: followerUserId } }, { new: true })
            if (!user) {
                res.sendStatus(404)
                return;
            }
            const userNew = {
                username: user.username,
                userId: user.userId,
                followers: user.followers,
                avatar: user.avatar
            }
            res.status(200).send(userNew)
        } catch (err) {
            console.log(err)
            res.sendStatus(500)
        }
    }
    static async unFollow(req, res) {
        try {
            const { id } = req.params;
            const followerUserId = req.user._id;
            if (id === followerUserId) {
                res.sendStatus(400)
                return
            }
            console.log(id)
            const user = await User.findByIdAndUpdate(id, { $pull: { followers: followerUserId } }, { new: true })
            if (!user) {
                res.sendStatus(404)
                return;
            }
            const userNew = {
                username: user.username,
                userId: user.userId,
                followers: user.followers,
                avatar: user.avatar
            }
            res.status(200).send(userNew)
        } catch (err) {
            console.log(err)
            res.sendStatus(500)
        }
    }



}





module.exports = UsersController;