'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const filePath = path.join(__dirname, file);
    let required;
    try {
      required = require(filePath);
    } catch (err) {
      console.error(`Failed to require ${filePath}:`, err);
      throw err;
    }
    if (typeof required !== 'function') {
      console.error(`Model file did not export a function: ${filePath}. Export type: ${typeof required}`);
      console.error('Exported value:', required);
      throw new TypeError(`Model file ${filePath} must export a function (sequelize, DataTypes) => model`);
    }
    const model = required(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
