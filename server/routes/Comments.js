const express = require('express');
const router = express.Router();
const models = require("../models");
const Comments = models.Comments;

// video 6 Pedrotech

router.get('/:postId', async (req, res) => {
    const id = req.params.postId;
    console.log(`[COMMENTS] GET /${id} - fetching comments for post ${id}`);
    const comments = await models.Comments.findAll({
        where: { postId: id }
    });
    res.json(comments);
});

router.post('/', async (req, res) => {
    const { commentBody, postId } = req.body;
    const created = await Comments.create({ commentBody, postId });
    res.json(created);
});

router.put('/:id/like', async (req, res) => {
    const id = req.params.id;
    const comment = await Comments.findByPk(id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    await comment.increment('likes');
    await comment.reload();
    res.json({ likes: comment.likes });
});

module.exports = router;
