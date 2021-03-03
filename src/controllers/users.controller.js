
const User = require('../models/user')
const md5 = require('md5')
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/environment/index');
const { findOne } = require('../models/user');
const Post = require('../models/post')
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

    static me(req, res) {
        res.send(req.user)

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
            console.log('not found')
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
            }).sort({createdAt:req.query.sort || -1 })
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
            const { _id, avatar } = user
            res.json({ _id, username, avatar })
        } catch (err) {
            console.log(err)
            res.sendStatus(500)
        }

    }






}





module.exports = UsersController;