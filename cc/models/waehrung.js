/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('waehrung', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    timestamps: false,
    tableName: 'waehrung'
  });
};
