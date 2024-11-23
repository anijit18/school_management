import mysql from 'mysql2'
import dotenv from "dotenv"

dotenv.config()

const pool=mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT,
    connectTimeout: 10000
}).promise()

export async function listSchools(){
    const [rows]=await pool.query("select * from schools")
    return rows
}

export async function addSchool(name,address,latitude,longitude){
    const [result] = await pool.query(
        `
            Insert into schools(name,address,latitude,longitude)
            values(?,?,?,?)
        `, [name,address,latitude,longitude]
    )
    return {
        id:result.insertId,
        name,
        address,
        latitude,
        longitude
    }
}

// const schools=await addSchool('bumrah', 'aus', 12.121212, 89.898989)
// console.log(schools)


async function testConnection() {
    try {
        console.log('Database connection successful:');
    } catch (error) {
        console.error('Database connection failed:', error);
    }
}
testConnection();