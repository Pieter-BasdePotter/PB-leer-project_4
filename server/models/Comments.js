module.exports = (sequelize, DataTypes) => {
   
    const Comments = sequelize.define('Comments', {
        commentBody: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        likes: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    })

    return Comments;
}