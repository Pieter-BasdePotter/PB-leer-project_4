module.exports = (sequelize, DataTypes) => {
    const Follows = sequelize.define('Follows', {
        followerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        followedId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        indexes: [
            // DB-level uniqueness guard — prevents duplicate follows even under race conditions
            { unique: true, fields: ['followerId', 'followedId'] },
            // Fast lookup when counting followers for a given user
            { fields: ['followedId'] },
        ],
    });

    Follows.associate = (models) => {
        Follows.belongsTo(models.Users, { as: 'follower', foreignKey: 'followerId' });
        Follows.belongsTo(models.Users, { as: 'followed', foreignKey: 'followedId' });
    };

    return Follows;
};
