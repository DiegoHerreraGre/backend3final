import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import otherRouter from './routes/sessions.router.js'
import router from './routes/index.js'
import { errorHandle } from './errors/errHandle.js'
import { logger } from './utils/loggers.js'

const app = express()
const PORT = 8080

// Middleware
app.use(express.json())
app.use(cookieParser())

// Logging middleware
app.use((req, next) => {
	logger.info(`${req.method} ${req.url}`)
	next()
})

// Rutas
app.use('/api', router)
app.use('/routes', otherRouter)

// Middleware de manejo de errores (debe ir después de las rutas)
app.use(errorHandle)

const connection = async () => {
	try {
		await mongoose.connect(
			`mongodb+srv://admin:VQohit6wULenyb3@backend-dhg.xvpi66f.mongodb.net/new-db?retryWrites=true&w=majority&appName=backend-dhg`
		)
		console.log('Connected to MongoDB')
	} catch (error) {
		console.error('Error connecting to MongoDB:', error)
	}
}

connection()

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
