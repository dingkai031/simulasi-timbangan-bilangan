const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const muridSchema = new Schema({
  nama: {
    type: String,
    required: true,
  },
  umur: {
    type: Number,
    required: true,
  },
  nilai: [
    {
      tanggal: {
        type: Date,
        required: true,
      },
      jumlahNilai: [
        {
          type: Number,
          required: true,
        },
      ],
    },
  ],
});

module.exports = mongoose.model('Murid', muridSchema);
