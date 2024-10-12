import { createHash, passwordValidation } from '../utils/index.js'
import jwt from 'jsonwebtoken'
import UserDTO from '../dto/User.dto.js'
import { UserServices } from '../services/user.services.js'

export class SessionsController {
	constructor() {
		this.userServices = new UserServices()
	}

	register = async (req, res, next) => {
		try {
			const { first_name, last_name, email, password } = req.body
			if (!first_name || !last_name || !email || !password) {
				return res
					.status(400)
					.send({ status: 'error', error: 'Incomplete values' })
			}

			const exists = await this.userServices.getByEmail(email)
			if (exists) {
				return res
					.status(400)
					.send({ status: 'error', error: 'User already exists' })
			}

			const hashedPassword = await createHash(password)
			const user = {
				first_name,
				last_name,
				email,
				password: hashedPassword,
			}

			let result = await this.userServices.create(user)
			if (!result) {
				return res
					.status(500)
					.send({ status: 'error', error: 'Failed to create user' })
			}

			res.status(201).send({ status: 'success', payload: result._id })
		} catch (error) {
			console.error('Error in register method:', error)
			res.status(500).send({ status: 'error', error: error.message })
		}
	}

	login = async (req, res, next) => {
		try {
			const { email, password } = req.body
			if (!email || !password)
				return res
					.status(400)
					.send({ status: 'error', error: 'Incomplete values' })
			const user = await this.userServices.getByEmail(email)
			if (!user)
				return res
					.status(404)
					.send({ status: 'error', error: "User doesn't exist" })
			const isValidPassword = await passwordValidation(user, password)
			if (!isValidPassword)
				return res
					.status(400)
					.send({ status: 'error', error: 'Incorrect password' })
			const userDto = UserDTO.getUserTokenFrom(user)
			const token = jwt.sign(userDto, 'tokenSecretJWT', {
				expiresIn: '1h',
			})
			res.cookie('coderCookie', token, { maxAge: 3600000 }).send({
				status: 'success',
				message: 'Logged in',
			})
		} catch (error) {
			next(error)
		}
	}

	current = async (req, res, next) => {
		try {
			const cookie = req.cookies['coderCookie']
			const user = jwt.verify(cookie, 'tokenSecretJWT')
			if (user) return res.send({ status: 'success', payload: user })
		} catch (error) {
			next(error)
		}
	}

	unprotectedLogin = async (req, res, next) => {
		try {
			const { email, password } = req.body
			if (!email || !password) {
				console.error('Error: Incomplete values', { email, password })
				return res
					.status(400)
					.send({ status: 'error', error: 'Valores incompletos' })
			}
			const user = await this.userServices.getByEmail(email)
			if (!user) {
				console.error("Error: User doesn't exist", { email })
				return res
					.status(404)
					.send({ status: 'error', error: 'El usuario no existe' })
			}
			const isValidPassword = await passwordValidation(user, password)
			if (!isValidPassword) {
				console.error('Error: Incorrect password for user', { email })
				return res
					.status(400)
					.send({ status: 'error', error: 'Contraseña incorrecta' })
			}
			const userForToken = {
				id: user._id,
				email: user.email,
				role: user.role,
			}
			const token = jwt.sign(userForToken, 'tokenSecretJWT', {
				expiresIn: '1h',
			})
			res.cookie('unprotectedCookie', token, { maxAge: 3600000 }).send({
				status: 'success',
				message: 'Inicio de sesión no protegido exitoso',
			})
		} catch (error) {
			console.error('Error en el método unprotectedLogin:', error)
			res.status(500).send({
				status: 'error',
				error: 'Error interno del servidor',
			})
		}
	}

	unprotectedCurrent = async (req, res, next) => {
		try {
			const cookie = req.cookies['unprotectedCookie']
			if (!cookie) {
				return res.status(401).send({
					status: 'error',
					error: 'No se encontró la cookie de autenticación',
				})
			}
			const user = jwt.verify(cookie, 'tokenSecretJWT')
			res.send({ status: 'success', payload: user })
		} catch (error) {
			console.error('Error en el método unprotectedCurrent:', error)
			if (error instanceof jwt.JsonWebTokenError) {
				return res
					.status(401)
					.send({ status: 'error', error: 'Token inválido' })
			}
			res.status(500).send({
				status: 'error',
				error: 'Error interno del servidor',
			})
		}
	}
}
