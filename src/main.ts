import express from 'express'
import 'dotenv/config'
import mongoose from 'mongoose'
import BodyParser from 'body-parser'
import { userRouter } from './modules/users/users.controller'
import { tokenValidation } from './modules/middlewares/auth.middleware'

const app = express()

app.use(BodyParser.json())
app.use(tokenValidation)
app.use('/api', userRouter)

const start = async () => {
  try {
    const PORT = process.env.PORT || 5000
    await mongoose.connect(process.env.MONGO_URL)
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
  } catch (error) {
    console.log('Server error', error.message)
  }
}

start()
