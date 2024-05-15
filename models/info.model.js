import { mongoose } from "mongoose";

const infoSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:String
       
},{timestamps:true});


//export const info = mongoose.model('info',infoSchema); // info is used as collection name , infos collection in database gets created
// if default export is not used ,to import info in server.js....it should be inside braces - {info}


// to use default export , it can written as below ----
//the default export below doesn't require {} while importing
const info = mongoose.model('info',infoSchema);
export default info;
