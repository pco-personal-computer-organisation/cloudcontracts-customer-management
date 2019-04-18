/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vertragspartner', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    KundenNr: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Firmenname: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    Vorname: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    Nachname: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    Telefon: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    Mobil: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    Fax: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    Mail: {
      type: DataTypes.STRING(40),
      allowNull: true
    }
  }, {
    timestamps: false,
    tableName: 'vertragspartner'
  });
};
