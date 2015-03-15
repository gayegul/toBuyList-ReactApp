'use strict';

var mongoose = require('mongoose');

var makeupSchema = new mongoose.Schema({
	brand: String,
	type: {type: String, default: 'Chanel'}
});

module.exports = mongoose.model('Makeup', makeupSchema);