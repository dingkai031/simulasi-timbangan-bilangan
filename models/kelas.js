const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kelasSchema = new Schema({
  'nama-kelas': {
    type: String,
    required: true,
  },
  murid: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Murid',
      default: null,
    },
  ],
});

module.exports = mongoose.model('Kelas', kelasSchema);
