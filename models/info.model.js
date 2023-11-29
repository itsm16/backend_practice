import { mongoose } from "mongoose";

mongoose.connect('mongodb://127.0.0.1:27017',({
    dbName:'Backend'
}))
.then(()=> console.log('Database Connected'))
.catch((e) => console.log(e))

const infoSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:String
       
},{timestamps:true}); //timestamps - gives createdAt , updatedAt


//export const info = mongoose.model('info',infoSchema); // info is used as collection name , infos collection in database gets created
// since export is used above ,to import info in server.js....it should be inside braces - {info}


// to use default it can written as ----
//the export below doesn't require {} while importing
const info = mongoose.model('info',infoSchema);
export default info;
