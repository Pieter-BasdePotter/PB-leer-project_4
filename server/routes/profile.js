const express = require('express');
const router = express.Router();
const models = require('../models');

// GET /profile/:username
// Returns user info, their posts, follower/following counts, and isFollowing for the current viewer.
router.get('/:username', async (req, res) => {
    const { username } = req.params;

    const user = await models.Users.findOne({ where: { username } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const [posts, followerCount, followingCount, followRow] = await Promise.all([
        models.Post.findAll({ where: { userName: username }, order: [['createdAt', 'DESC']] }),
        models.Follows.count({ where: { followedId: user.id } }),
        models.Follows.count({ where: { followerId: user.id } }),
        models.Follows.findOne({ where: { followerId: req.user.id, followedId: user.id } }),
    ]);

    res.json({
        user: { id: user.id, username: user.username, createdAt: user.createdAt },
        posts,
        followerCount,
        followingCount,
        isFollowing: !!followRow,
    });
});

// POST /profile/:username/follow
// Follow a user. Actor is derived from JWT — client never supplies followerId.
router.post('/:username/follow', async (req, res) => {
    const { username } = req.params;

    const target = await models.Users.findOne({ where: { username } });
    if (!target) return res.status(404).json({ error: 'User not found' });

    if (req.user.id === target.id) {
        return res.status(400).json({ error: 'You cannot follow yourself' });
    }

    // findOrCreate prevents duplicate follows; the unique index is a second safety net.
    await models.Follows.findOrCreate({
        where: { followerId: req.user.id, followedId: target.id },
    });

    const followerCount = await models.Follows.count({ where: { followedId: target.id } });
    res.json({ following: true, followerCount });
});

// DELETE /profile/:username/follow
// Unfollow a user.
router.delete('/:username/follow', async (req, res) => {
    const { username } = req.params;

    const target = await models.Users.findOne({ where: { username } });
    if (!target) return res.status(404).json({ error: 'User not found' });

    await models.Follows.destroy({
        where: { followerId: req.user.id, followedId: target.id },
    });

    const followerCount = await models.Follows.count({ where: { followedId: target.id } });
    res.json({ following: false, followerCount });
});

module.exports = router;
