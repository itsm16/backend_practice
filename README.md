/*
field_name:{
         type:mongoose.Schema.Types.ObjectId,    //this is a method used to take reference from another schema
         ref:'model_name'    // ref should be used to get reference , name of schema to take reference is added here
     }
     
    field_name:{
         type:[]    // sometimes types are an array but js using array doesn't solve it ...such as an array for orderItems , defining quantity etc. ↓↓↓
                    // In such cases ANOTHER SCHEMA for the items inside array is created/used
            
         enum:''    // in few cases when type is string , and a preDefined set of strings are need to be provided ...we use
                     //in such cases enum is used which provides choices to use for the string

         default:''  // default provides a default string that is used   
    }
*/
