const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
  nama: {
    type: String,
    required: true,
  },
  kelas: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Kelas',
      default: null,
    },
  ],
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
