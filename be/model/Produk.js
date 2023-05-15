import {Sequelize} from "sequelize";
import {db} from "../config/Db.js";

const {DataTypes} = Sequelize

const Produk = db.define('produk', {
  name: DataTypes.STRING,
  buy_price: {
    type: DataTypes.DECIMAL(10, 2), // ketepatan 10 dan skala 2
    allowNull: false
  },
  sell_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  photo: DataTypes.STRING,
  photo_url: DataTypes.STRING,
}, {
  freezeTableName: true
})

export default Produk;

(async () => {
  await db.sync()
})()
