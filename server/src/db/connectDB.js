import "dotenv/config.js"
import mongoose from "mongoose"



const databaseConnect = async () => {
    try {
        const db = await mongoose.connect(`${process.env.DATABASE_URL}/${process.env.DATABSE_NAME}`)
        console.log(`Successfully connected to the database ${db.connection.host}`)

        // console.log(db)
    } catch (err) {
        console.error(err)
        console.log("Error while connencting database")
    }
}



export { databaseConnect }