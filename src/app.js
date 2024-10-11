import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import otherRouter from './routes/sessions.router.js'
import router from './routes/index.js'
import { errorHandle } from './errors/errHandle.js'

const app = express()
const PORT = 8080
const connection = () => {
	try {
		mongoose.connect(
			`mongodb+srv://admin:VQohit6wULenyb3@backend-dhg.xvpi66f.mongodb.net/new-db?retryWrites=true&w=majority&appName=backend-dhg`
		)
		console.log('Connected to MongoDB')
	} catch (error) {
		console.log(error)
	}
}

connection()
app.use(express.json())
app.use(cookieParser())

app.use('/api', router)
app.use('/routes', otherRouter)

// Middleware de manejo de errores
app.use(errorHandle)

app.listen(PORT, () => console.log(`Listening on ${PORT}`))
