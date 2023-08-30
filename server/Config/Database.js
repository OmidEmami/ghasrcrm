import { Sequelize } from "sequelize";
 
const db = new Sequelize('ghasrcrm', 'root', '', {
    host: "localhost",
    dialect: "mysql"
});

export default db;

