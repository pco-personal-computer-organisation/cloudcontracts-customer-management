module.exports = (sequelize, DataTypes) => sequelize.define('AccessToken', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  ttl: DataTypes.INTEGER,
  created: DataTypes.DATE,
  userId: DataTypes.INTEGER,
}, {
  createdAt: 'created',
  updatedAt: false,
  paranoid: false,
  timestamps: true,
  freezeTableName: true,
});
