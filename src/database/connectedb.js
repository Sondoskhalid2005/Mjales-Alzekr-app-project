const mongoose=require("mongoose")
const connectTodb=async()=>{
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/mjales-Alzekr-dataBase')
        console.log('Connected to database!');
       }
    catch(error){
        console.error(error);   
       }
}
module.exports = {connectTodb};