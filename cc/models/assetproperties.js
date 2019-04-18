/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('assetproperties', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idVertragsgegenstand: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
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
    tableName: 'assetproperties'
  });
};
