import { UserServices } from '../services/user.services.js'
import { AdoptionServices } from '../services/adoption.services.js'
import { PetServices } from '../services/pet.services.js'

export class AdoptionsController {
	constructor() {
		this.adoptionsService = new AdoptionServices()
		this.usersService = new UserServices()
		this.petsService = new PetServices()
	}

	getAllAdoptions = async (req, res, next) => {
		try {
			const result = await this.adoptionsService.getAll()
			if (!result || result.length === 0) {
				return res
					.status(404)
					.send({ status: 'error', message: 'No adoptions found' })
			}
			return res.status(200).send({ status: 'success', payload: result })
		} catch (error) {
			console.error('Error in getAllAdoptions:', error)
			return res.status(500).send({
				status: 'error',
				message: 'Internal server error',
				error: error.message,
			})
			next()
		}
	}

	getAdoption = async (req, res, next) => {
		try {
			const aid = req.params
			const adoption = await this.adoptionsService.getById(aid)
			if (!adoption) {
				return res
					.status(404)
					.send({ status: 'error', error: 'Adoption not found' })
			}
			return res
				.status(200)
				.send({ status: 'success', payload: adoption })
		} catch (error) {
			next(error)
		}
	}

	createAdoption = async (req, res, next) => {
		try {
			const { uid, pid } = req.params

			// Obtener el usuario
			const user = await this.usersService.getById(uid)
			if (!user) {
				return res
					.status(404)
					.send({ status: 'error', error: 'User not found' })
			}

			// Obtener la mascota
			const pet = await this.petsService.getById(pid)
			if (!pet) {
				return res
					.status(404)
					.send({ status: 'error', error: 'Pet not found' })
			}

			if (pet.adopted) {
				return res
					.status(400)
					.send({ status: 'error', error: 'Pet is already adopted' })
			}

			// Actualizar el usuario
			user.pets.push(pet._id)
			await this.usersService.update(user._id, { pets: user.pets })

			// Actualizar la mascota
			await this.petsService.update(pet._id, {
				adopted: true,
				owner: user._id,
			})

			// Crear la adopción
			const adoption = await this.adoptionsService.create({
				owner: user._id,
				pet: pet._id,
			})

			return res
				.status(201)
				.send({ status: 'success', message: 'Pet adopted', adoption })
		} catch (error) {
			console.error('Error in createAdoption:', error)
			next(error)
		}
	}
}
