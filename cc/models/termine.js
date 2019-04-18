/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('termine', {
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
    Text: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    InfoAn: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    TerminIntervall: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    Erinnerung: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    }
  }, {
    timestamps: false,
    tableName: 'termine'
  });
};
