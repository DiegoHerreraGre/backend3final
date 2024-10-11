import __dirname from './index.js'
import multer from 'multer'

const storage = multer.diskStorage({
	destination: function (cb) {
		cb(null, `${__dirname}/../public/img`)
	},
	filename: function (file, cb) {
		cb(null, `${Date.now()}-${file.originalname}`)
	},
})

const uploader = multer({ storage })

export default uploader
