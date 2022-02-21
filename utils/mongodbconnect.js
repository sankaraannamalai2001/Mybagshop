let dotenv=require('dotenv');
const mongoose=require('mongoose');
dotenv.config();
function dbConnection(){
    mongoose.connect(
        mybag.env.DB_Connection,
       { useNewUrlParser: true },
       () => console.log("Connected to DB")
     );
}
module.exports={dbConnection};