const { default: mongoose } = require("mongoose");
exports.dbConnect =()=>{
// mongoose.connect("mongodb://localhost:27017/Cat")
mongoose.connect("mongodb+srv://adminpanel:admin$123@adminpanel.08qbg.mongodb.net/")
.then(()=>{
  console.log("db connect");
})
.catch((err)=>{
  console.log(err);
})
}