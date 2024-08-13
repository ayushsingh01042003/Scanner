import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: String,
  email: String,
  name: String,
});

const GoogleUser = mongoose.model('googleuser', userSchema);
export default GoogleUser;
