
const User = require('../models/user')
const md5 = require('md5')
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/environment/index')

class UsersController {

    static create(req, res) {
        req.body.password = md5(req.body.password);
        const user = new User(req.body);
        user.save()
            .then(newUser => {
                res.status(201).send(newUser)
            })
            .catch((err) => {
                console.log(err)
                res.status(400).send(err)
            })
    }


    static login(req, res) {
        User.findOne({
            username: req.body.username,
            password: md5(req.body.password)
        }).then(user => {
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
        }).catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
    }

    static me(req, res) {
        try {
            const payload = jwt.verify(req.body.token, jwtSecret)
            User.findById(payload._id)
            .then(user => {
                if (!user) {
                    res.sendStatus(401);
                    return;
                }
                res.send({
                    _id:user._id,
                    username:user.username,
                    email:user.email
                });
            }).catch(err => {
                console.log(err);
                res.sendStatus(500)
            })
        } catch (err) {
            res.sendStatus(401)
        }

    }


    static checkEmail(req, res) {
        User.findOne({
            email: req.params.emailVal
        }).then(user => {
            if (user) {
                console.log('found')
                res.send(false)
               
                return;
            }
            res.send(true);
            console.log('not found')
        })
        .catch((err) => {
            res.sendStatus(500)
        })

    }
    static checkUsername(req, res) {
        User.findOne({
            username: req.params.usernameVal
        }).then(user => {
            if (user) {
                res.send(false)
                return;
            }
            res.send(true);
            console.log('not found')
        })
        .catch((err) => {
            res.sendStatus(500)
        })

    }


}





module.exports = UsersController;