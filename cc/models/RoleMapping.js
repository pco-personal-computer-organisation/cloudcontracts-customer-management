/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('RoleMapping', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    principalType: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    principalId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    roleId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    timestamps: false,
    tableName: 'RoleMapping'
  });
};
