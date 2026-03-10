module.exports = (sequelize, DataTypes) => {

    const Users = sequelize.define('Users', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    })

    Users.associate = (models) => {
        Users.hasMany(models.Post, {
            onDelete: 'cascade',
        })
    }
    
    return Users;
}