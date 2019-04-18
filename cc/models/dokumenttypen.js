module.exports = (sequelize, DataTypes) => sequelize.define('dokumenttypen', {
  id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  bezeichnung: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
}, {
  timestamps: false,
  tableName: 'dokumenttypen',
});
