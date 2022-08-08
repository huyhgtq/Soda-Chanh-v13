const mongoose = require('mongoose');

const randomuser = mongoose.Schema({
  
	discordId: {
    type: String,
    required: true,
  },
	usernames: {
    type: Array,
    default: [],
  },
	randoms: {
  type: Array,
  },
	rep: {
    type: Number,
    required: false,
  },
image: {
    type: mongoose.SchemaTypes.String,
    required: false,
  },
  lastVoted: { type: Number },
  votes: { type: Number }
	
});


module.exports = mongoose.model('RandomUser', randomuser);