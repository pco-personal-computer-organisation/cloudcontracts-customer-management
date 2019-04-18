/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ACL', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    model: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    property: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    accessType: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    permission: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    principalType: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    principalId: {
      type: DataTypes.STRING(512),
      allowNull: true
    }
  }, {
    timestamps: false,
    tableName: 'ACL'
  });
};
