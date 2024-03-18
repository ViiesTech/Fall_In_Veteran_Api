const mongoose = require('mongoose'); // include mongodb package

const Connect_DB = () => {

    mongoose.set('strictQuery', true);
    // mongoose.connect('mongodb+srv://taharasheedd666:Tfllg5IkMhDgOKyH@fallinveteran.lqcnj45.mongodb.net/');
    mongoose.connect('mongodb://localhost:27017/Fall_In_Veteran');
    const db = mongoose.connection;
    db.on("error",(error)=>console.log("error",error));
    db.once("open",()=>console.log("DB Connected"));
}


module.exports = Connect_DB