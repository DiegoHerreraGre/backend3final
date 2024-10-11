import petModel from './models/Pet.js'

export default class Pet {
	get = (params) => {
		return petModel.find(params)
	}

	getBy = (id) => {
		return petModel.findById(id)
	}

	save = (doc) => {
		return petModel.create(doc)
	}

	saveMany = (docs) => {
		return petModel.insertMany(docs)
	}

	update = (id, doc) => {
		return petModel.findByIdAndUpdate(id, { $set: doc })
	}

	delete = (id) => {
		return petModel.findByIdAndDelete(id)
	}
}
