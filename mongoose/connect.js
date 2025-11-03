const mongoose = require('mongoose');
const rootDb = process.env.MONGODB_URL

async function Connect(){
  try{
    await mongoose.connect(rootDb);
    console.log("database Connected..")
  }catch(err){
    console.log(err.message)
  }
}

module.exports = Connect