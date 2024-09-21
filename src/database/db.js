import mongoose from "mongoose";

const DB_CONNECTION = "mongodb+srv://anhnq17062004:2NEOoe0AQufEfdq0@web83ls4.dcjca.mongodb.net/?retryWrites=true&w=majority&appName=web83ls4/web83"

const connectDatabase = async ()=>{
    try {
        await mongoose.connect(DB_CONNECTION)
        console.log('Database connected successfully')
        
    } catch (error) {
        console.log('failed to connect to the database',error)
        process.exit(1)
    }
}

export default connectDatabase;