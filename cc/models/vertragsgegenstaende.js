/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vertragsgegenstaende', {
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
    Nummer: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Bezeichnung: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    Menge: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true
    }
  }, {
    timestamps: false,
    tableName: 'vertragsgegenstaende'
  });
};
