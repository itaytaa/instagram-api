const Post = require('../models/post')


class PostsController {

    static async feed(req, res) {
        console.log('feed')
        try {
           
            const posts = await Post.find()
            res.send(posts)
        } catch {
            res.sendStatus(500)
        }

    }

}

module.exports = PostsController;