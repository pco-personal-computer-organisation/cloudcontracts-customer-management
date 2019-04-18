/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vertrag', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idVertragspartner: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true
    },
    idKategorie: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    Vertragsnr: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    Bezeichnung: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Art: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    Status: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    Rahmenvertragsnr: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    AblageortOriginal: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    Bemerkung: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    AngelegtVon: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    Anlagedatum: {
      type: DataTypes.DATE,
      allowNull: true
    },
    LaufzeitBeginn: {
      type: DataTypes.DATE,
      allowNull: true
    },
    LaufzeitEnde: {
      type: DataTypes.DATE,
      allowNull: true
    },
    Mindestlaufzeit: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    Kuendigungsfrist: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    Kuendigungsdatum: {
      type: DataTypes.DATE,
      allowNull: true
    },
    AutoVerlaengerung: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    LaufzeitVerlaengerung: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    Vertragsstrafe: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Konto: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Kostenstelle: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    BestellNr: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Verantwortlicher: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    idKoordinator: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    Organisationseinheit: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    Vertragsart: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    kuendigungsoption: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    idparent: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true
    },
    benachrichtigungCtr: {
      type: DataTypes.INTEGER(3).UNSIGNED,
      allowNull: false,
      defaultValue: '0'
    }
  }, {
    timestamps: false,
    tableName: 'vertrag'
  });
};
