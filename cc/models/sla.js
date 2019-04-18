/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sla', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idVertrag: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    Name: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    Wert: {
      type: DataTypes.STRING(250),
      allowNull: true
    }
  }, {
    timestamps: false,
    tableName: 'sla'
  });
};
