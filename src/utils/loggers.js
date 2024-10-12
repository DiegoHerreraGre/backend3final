import { createLogger, format, transports } from 'winston'

const { combine, timestamp, printf, colorize, align, errors } = format

// Formato personalizado mejorado
const customFormat = printf(({ level, message, timestamp, ...metadata }) => {
	const metadataString = Object.keys(metadata).length
		? `\n\t${JSON.stringify(metadata, null, 2)}`
		: ''
	return `${timestamp} [${level.toUpperCase()}]: ${message}${metadataString}`
})

export const logger = createLogger({
	level: process.env.LOG_LEVEL || 'info',
	format: combine(
		errors({ stack: true }), // Incluye stack trace para errores
		colorize({ all: true }),
		timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
		align(),
		customFormat
	),
	transports: [
		new transports.Console({
			format: format.combine(format.colorize(), format.simple()),
		}),
		new transports.File({
			filename: 'logs/error.log',
			level: 'error',
			maxsize: 5242880, // 5MB
			maxFiles: 5,
		}),
		new transports.File({
			filename: 'logs/combined.log',
			maxsize: 5242880, // 5MB
			maxFiles: 5,
		}),
	],
	exceptionHandlers: [
		new transports.File({ filename: 'logs/exceptions.log' }),
	],
	rejectionHandlers: [
		new transports.File({ filename: 'logs/rejections.log' }),
	],
})
