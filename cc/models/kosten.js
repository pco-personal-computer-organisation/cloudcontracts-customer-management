/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('kosten', {
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idVertrag: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    idFaelligkeit: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    idWaehrung: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    kosten: {
      type: "DOUBLE",
      allowNull: true
    },
    datum: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    timestamps: false,
    tableName: 'kosten'
  });
};
