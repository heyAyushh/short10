const mongoose = require('mongoose');
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../.env') });

const url = process.env.MONGODB_URI;
var uniqueValidator = require('mongoose-unique-validator');

mongoose.connect(url, { useNewUrlParser: true }).then(console.log('connected to MongoDB')).catch((error) => {
	console.log('error connecting to MongoDB:', error.message);
});

const contactSchema = new mongoose.Schema({
	user: {
		type: String,
		required: true,
		minlength: 3
	},
	url: {
		type: String,
		required: true,
		minlength: 5,
		unique: false
	},
	shortenedUrl: {
		type: String,
		required: true,
		unique: true
	},
	createdAt: {
		type: Date,
		expires: process.env.LINK_EXPIRY
	}
});

contactSchema.plugin(uniqueValidator);

contactSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	}
});

module.exports = mongoose.model('Link', contactSchema);
