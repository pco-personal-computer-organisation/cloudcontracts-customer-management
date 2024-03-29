/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('laufzeitende', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    tage: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    timestamps: false,
    tableName: 'laufzeitende'
  });
};
