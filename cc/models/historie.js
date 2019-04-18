/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('historie', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idVertrag: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    Datum: {
      type: DataTypes.DATE,
      allowNull: true
    },
    idUser: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    ChangedModel: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    diff: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    timestamps: false,
    tableName: 'historie'
  });
};
