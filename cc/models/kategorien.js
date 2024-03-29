/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('kategorien', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    Name: {
      type: DataTypes.STRING(60),
      allowNull: true
    }
  }, {
    timestamps: false,
    tableName: 'kategorien'
  });
};
