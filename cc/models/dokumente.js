module.exports = (sequelize, DataTypes) => sequelize.define('dokumente', {
  id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  idVertrag: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
  Datum: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  Dateiname: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  URL: {
    type: DataTypes.STRING(250),
    allowNull: false,
  },
  idTyp: {
    type: DataTypes.INTEGER(10),
    defaultValue: 1,
  },
  idUser: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
  },
}, {
  timestamps: false,
  tableName: 'dokumente',
});
