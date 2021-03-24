const Post = require('../models/post')
const fs = require('fs').promises;
const User = require('../models/user')
const Comment = require('../models/comment')
class PostsController {

    static async feed(req, res) {
        try {
           const  followers = await User.find({ followers: req.user._id })
            let followersId = followers.map(user => {
                return user._id
            })
            followersId.push(req.user._id)
            console.log(followersId)
            const posts = await Post.find({ "user": { $in: followersId } }).populate('user', ['username', 'avatar']).sort({ createdAt: req.query.sort || 1 })
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

    static async like(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user._id;
            const post = await Post.findByIdAndUpdate(id, { $addToSet: { likes: userId } }, { new: true })
            if (!post) {
                res.sendStatus(404)
                return;
            }
            res.status(200).send(post)
        } catch (err) {
            console.log(err)
            res.sendStatus(500)

        }
    }
    static async unLike(req, res) {
        try {
            const { id } = req.params;
            const { userId } = req.params;
            const post = await Post.findByIdAndUpdate(id, { $pull: { likes: userId } }, { new: true })
            if (!post) {
                res.sendStatus(404)
                return
            }
            res.status(200).send(post)
        } catch (err) {
            console.log(err)
            res.sendStatus(500)

        }
    }

    static async addComment(req, res) {
        const { id } = req.params;
        const userId = req.user._id;
        try {
            const comment = new Comment({
                postId: id,
                content: req.body.content,
                user: userId
            });
            const newComment = await comment.save();
            await newComment.populate('user', ['avatar', 'username'])
                .execPopulate();
            res.status(201).send(newComment)
        } catch (err) {
            console.log(err)
            res.sendStatus(400)
        }
    }
    static async deleteComment(req, res) {
        const { id } = req.params;
        console.log(id)
        const userId = req.user._id;
        try {
            const comment = await Comment.findByIdAndRemove(id)
            if (comment) {
                res.status(200).send(comment)
            }
        } catch (err) {
            console.log(err)
            res.sendStatus(400)
        }
    }

    static async getComments(req, res) {
        const postId = req.params.id;
        try {
            const comments = await Comment.find({ postId }).populate('user', ['username', 'avatar']);
            res.send(comments)
        } catch (err) {
            console.log(err)
            res.send(500)
        }
    }




    static async likeComment(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user._id;
            const comment = await Comment.findByIdAndUpdate(id, { $addToSet: { likes: userId } }, { new: true })
            if (!comment) {
                res.sendStatus(404)
                return;
            }
            res.status(200).send(comment)
        } catch (err) {
            console.log(err)
            res.sendStatus(500)

        }
    }

    static async unLikeComment(req, res) {
        try {
            const { id } = req.params;
            const { userId } = req.params;
            const comment = await Comment.findByIdAndUpdate(id, { $pull: { likes: userId } }, { new: true })
            if (!comment) {
                res.sendStatus(404)
                return
            }
            res.status(200).send(comment)
        } catch (err) {
            console.log(err)
            res.sendStatus(500)

        }
    }



}

module.exports = PostsController;