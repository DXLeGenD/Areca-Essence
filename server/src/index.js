import 'dotenv/config'
import { app } from "./app.js"
import { databaseConnect } from './db/connectDB.js'

databaseConnect()

app.listen(process.env.PORT, () => {
    console.log(`Server is listening at port ${process.env.PORT}`)
})