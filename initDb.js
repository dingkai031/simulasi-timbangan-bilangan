const mongoose = require('mongoose');
const User = require('./models/user');
const Kelas = require('./models/kelas');
const Murid = require('./models/murid');

mongoose
  .connect(
    'mongodb://yovan:123456@localhost:27017/webta?authSource=webta&readPreference=primary&appname=MongoDB%20Compass&ssl=false'
  )
  .then(() => {
    console.log('koneksi sukses ke Database port 27017 Sukses');
  })
  .catch((e) => {
    console.log(`koneksi ke data base tidak berhasil : ${e}`);
  });

const seedDb = async (model, arrOfObj) => {
  await model.deleteMany({});
  await model
    .insertMany(arrOfObj)
    .then((data) => {
      console.log(data);
    })
    .catch((e) => {
      console.log(`ERROR : ${e}`);
    });
};

const newUserOne = async function (obj, pass) {
  registeredUser = await User.register(obj, pass);
  console.log(registeredUser);
};

const murid = [
  {
    nama: 'Vino Hakim',
    umur: 6,
  },
  {
    nama: 'Nurul Hasanah',
    umur: 6,
  },
  {
    nama: 'Violet Mayasari',
    umur: 7,
  },
  {
    nama: 'Ulya Hartati',
    umur: 8,
  },
  {
    nama: 'Endah Riyanti',
    umur: 6,
  },
  {
    nama: 'Adinata Mansur',
    umur: 6,
  },
  {
    nama: 'Kuncara Januar',
    umur: 6,
  },
  {
    nama: 'Ilsa Hartati',
    umur: 6,
  },
  {
    nama: 'Ian Simbolon',
    umur: 6,
  },
  {
    nama: 'Rudi Santoso',
    umur: 6,
  },
  {
    nama: 'Simon Santoso',
    umur: 6,
  },
  {
    nama: 'Eva Lestari',
    umur: 6,
  },
  {
    nama: 'Irsad Halim',
    umur: 6,
  },
  {
    nama: 'Ajeng Laksmiwati',
    umur: 6,
  },
  {
    nama: 'Irwan Prasetya',
    umur: 6,
  },
];

const kelas = [
  {
    'nama-kelas': 'kelas 2a',
    murid: [
      mongoose.Types.ObjectId('61a1de3fb2f28ff7168ff234'),
      mongoose.Types.ObjectId('61a1de3fb2f28ff7168ff235'),
      mongoose.Types.ObjectId('61a1de3fb2f28ff7168ff236'),
      mongoose.Types.ObjectId('61a1de3fb2f28ff7168ff237'),
    ],
  },
  {
    'nama-kelas': 'kelas 2b',
    murid: [
      mongoose.Types.ObjectId('61a1de3fb2f28ff7168ff238'),
      mongoose.Types.ObjectId('61a1de3fb2f28ff7168ff239'),
      mongoose.Types.ObjectId('61a1de3fb2f28ff7168ff23a'),
      mongoose.Types.ObjectId('61a1de3fb2f28ff7168ff23b'),
    ],
  },
  {
    'nama-kelas': 'kelas 2c',
    murid: [
      mongoose.Types.ObjectId('61a1de3fb2f28ff7168ff23c'),
      mongoose.Types.ObjectId('61a1de3fb2f28ff7168ff23d'),
      mongoose.Types.ObjectId('61a1de3fb2f28ff7168ff23e'),
      mongoose.Types.ObjectId('61a1de3fb2f28ff7168ff23f'),
    ],
  },
  {
    'nama-kelas': 'kelas 2d',
    murid: [
      mongoose.Types.ObjectId('61a1de3fb2f28ff7168ff240'),
      mongoose.Types.ObjectId('61a1de3fb2f28ff7168ff241'),
      mongoose.Types.ObjectId('61a1de3fb2f28ff7168ff242'),
    ],
  },
];

// seedDb(Kelas, kelas).then(() => {
//   mongoose.connection.close();
// });

// newUserOne(
//   {
//     nama: 'Kurnia Prayoga',
//     username: 'kurnia031',
//     kelas: [
//       mongoose.Types.ObjectId('61a1e3eb1677dafb3bbdad77'),
//       mongoose.Types.ObjectId('61a1e3eb1677dafb3bbdad78'),
//     ],
//   },
//   '123456'
// );
