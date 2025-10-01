import mongoose from 'mongoose'
import {DB_NAME} from '../constant.js'

const connectDB = async()=>{
    try{
        const response =  await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`  )
        console.log(`mongo db connected  DB_Host ${response.connection.host}`)
    }catch(error){
        console.log(`error ${error}`)
        process.exit(1)
    }
}
export default  connectDB