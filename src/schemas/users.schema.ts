import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: Number, min: 1, max: 100, required: true },
  email: { type: String, unique: true, required: true },
  role: { type: String, required: true },
  password: { type: String, required: true },
})

export const UserSchema = mongoose.model('User', userSchema)
