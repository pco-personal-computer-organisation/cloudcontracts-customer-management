module.exports = (sequelize, DataTypes) => sequelize.define('kunden', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: DataTypes.STRING,
  kdnr: DataTypes.STRING,
  status: DataTypes.INTEGER,
  maxusers: DataTypes.INTEGER,
  quota: DataTypes.INTEGER,
  created: DataTypes.DATE,
  createdBy: DataTypes.STRING,
  laufzeitende: DataTypes.DATE,
  instanceUrl: DataTypes.STRING,
}, {
  createdAt: 'created',
  updatedAt: false,
  paranoid: false,
  timestamps: true,
  freezeTableName: true,
});
