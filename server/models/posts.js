module.exports = (sequelize, DataTypes) => {
   
    const Post = sequelize.define('Post', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        postText: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
        }, 
    })

    Post.associate = (models) => {
        Post.hasMany(models.Comments, {
            foreignKey: 'postId',
            onDelete: 'cascade',
            constraints: false,
        })
    }
    
    return Post;
}