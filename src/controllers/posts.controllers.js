const Post = require('../models/post')
const fs = require('fs').promises;

class PostsController {

    static async feed(req, res) {
  
        try {

            const posts = await Post.find().populate('user', ['username', 'avatar']).sort({createdAt:req.query.sort || 1 })
            res.send(posts)
        } catch {
            res.sendStatus(500)
        }

    }
    static async create(req, res) {
        const fileName = req.file.filename;
        try {
            const imageBase64 = await fs.readFile('public/posts/' + fileName, {
                encoding: 'base64'
            });

            const post = new Post({
                description: req.body.description,
                image: imageBase64,
                user: req.user._id
            });

            const newPost = await post.save();
            res.status(201).send(newPost);
        } catch (err) {
            console.log(err);
            res.sendStatus(400);
        }
    }

    static async getPost(req, res) {
        try {
            const post = await Post
                .findById(req.params.id)
                .populate('user', ['username', 'avatar'])
            if (!post) {
                res.sendStatus(404)
                return
            }
            res.send(post)
        } catch (err) {
            console.log(err)
            res.sendStatus(500)
        }
    }



}

module.exports = PostsController;