import { mongoose } from "mongoose";

const connectDb = () => {
    mongoose.connect('mongodb://127.0.0.1:27017',({
    dbName:'Backend'
}))
.then(()=> console.log('Database Connected'))
.catch((e) => console.log(e))
}

export default connectDb;
