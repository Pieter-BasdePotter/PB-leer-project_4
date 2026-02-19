const express = require('express');
const router = express.Router();
const models = require("../models");
const Comments = models.Comments;

router.get('/:postId', async (req, res) => {
    const id = req.params.postId;
    const comments = await models.Comments.findAll({
        where: { postId: id }
    });
    res.json(comments);
});

router.post('/', async (req, res) => {
    const comment = req.body;
    const created = await Comments.create(comment);
    res.json(created);
});
module.exports = router;
