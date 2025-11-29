const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select:false },
  country: { type: String, required: true },
  course: { type: String, required: true },
  hobby: { type: String },
  isAdmin:{type:Boolean, default:false}
});

const UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel
