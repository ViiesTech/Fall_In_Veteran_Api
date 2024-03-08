const mongoose = require('mongoose'); // include mongodb package

const Connect_DB = () => {

    mongoose.set('strictQuery', true);
    mongoose.connect('mongodb://localhost:27017/Fall_In_Veteran');
    const db = mongoose.connection;
    db.on("error",(error)=>console.log(error));
    db.once("open",()=>console.log("DB Connected"));
}


module.exports = Connect_DB