const { isLoggedIn } = require('./middleware');

const User = require('./models/user');
const Kelas = require('./models/kelas');
const Murid = require('./models/murid');

const methodOverride = require('method-override');
const express = require('express');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const path = require('path');
const session = require('express-session');
const ejsMate = require('ejs-mate');
const passport = require('passport');
const passportLocal = require('passport-local');
const flash = require('connect-flash');
const querystring = require('querystring');
const app = express();

const sessionConfig = {
  secret: 'secret',
  store: MongoStore.create({
    mongoUrl:
      'mongodb://yovan:123456@localhost:27017/webta?authSource=webta&readPreference=primary&appname=MongoDB%20Compass&ssl=false',
  }),
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

mongoose
  .connect(
    'mongodb://yovan:123456@localhost:27017/webta?authSource=webta&readPreference=primary&appname=MongoDB%20Compass&ssl=false'
  )
  .then(() => {
    console.log('koneksi sukses ke Database port 27017 Sukses');
  })
  .catch((e) => {
    console.log(`koneksike data base tidak berhasil : ${e}`);
  });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(methodOverride('_method'));
app.use(session(sessionConfig));
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
app.use(express.static(path.join(__dirname, 'node_modules/three')));
app.use(express.static(path.join(__dirname, 'node_modules/sweetalert2')));
app.use(express.static(path.join(__dirname, 'node_modules/tom-select')));
app.use(express.static(path.join(__dirname, 'node_modules/luxon')));
app.use(
  express.static(path.join(__dirname, 'node_modules/@linways/table-to-excel/'))
);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.hapus = req.flash('hapus');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user;
  next();
});

app.engine('ejs', ejsMate);

passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.render('login');
  }
  res.redirect('/home');
});

app.get('/home', isLoggedIn, (req, res) => {
  res.render('home');
});

app.post(
  '/',
  passport.authenticate('local', {
    failureFlash: 'Username atau password salah',
    failureRedirect: '/',
  }),
  (req, res) => {
    const redirectUrl = req.session.returnTo || '/';
    res.redirect(redirectUrl);
  }
);

app.get('/kalibrasi', isLoggedIn, (req, res) => {
  res.render('kalibrasi');
});

app.get('/pilih-kelas', isLoggedIn, async (req, res) => {
  const currentUser = await User.findById(req.user._id).populate('kelas');
  res.render('pilihKelas', { currentUser });
});

app.post('/pilih-kelas', isLoggedIn, (req, res) => {
  const query = querystring.stringify({
    namaPengajar: req.body.namaPengajar,
    kelas: req.body.kelas,
    kelasId: req.body.kelasId,
    tanggal: req.body.tanggal,
  });
  res.redirect('/mulai-kelas?' + query);
});

app.get('/mulai-kelas', isLoggedIn, async (req, res) => {
  if (Object.keys(req.query).length === 0) {
    req.flash('error', 'Silahkan pilih kelas terlebih dahulu');
    return res.redirect('/pilih-kelas');
  }
  const tempArray = req.query.kelas.split('.');
  const idKelas = tempArray[1];
  const namaKelas = tempArray[0];
  const query = {
    namaPengajar: req.query.namaPengajar,
    namaKelas,
    idKelas,
    tanggal: req.query.tanggal,
  };
  const kelas = await Kelas.findById(idKelas)
    .populate('murid')
    .catch(() => {
      req.flash('error', 'Kelas tidak ditemukan');
      return res.redirect('/pilih-kelas');
    });
  kelas.jumlahMurid = kelas.murid.length;
  const kelasRaw = JSON.stringify(kelas);

  res.render('mulaiKelas', { query, kelas, kelasRaw });
});

app.put('/mulai-kelas', isLoggedIn, async (req, res) => {
  const tanggal = new Date(req.body.tanggal);
  for (let i = 0; i < req.body.score.length; i++) {
    const murid = await Murid.findById(req.body.id[i]).catch((e) => {
      console.log(`Error : ${e}`);
    });
    if (!murid) {
      continue;
    }
    const foundIndex = murid.nilai.findIndex(
      (obj) => obj.tanggal.getTime() === tanggal.getTime()
    );
    if (foundIndex === -1) {
      murid.nilai.push({
        tanggal,
        jumlahNilai: [Math.abs(parseFloat(req.body.score[i])) < 0.15 ? 1 : 0],
      });
      await murid
        .save()
        .then((data) => {
          console.log(data);
          console.log('Data saved!');
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      murid.nilai[foundIndex].jumlahNilai.push(
        Math.abs(parseFloat(req.body.score[i])) < 0.15 ? 1 : 0
      );
      await murid
        .save()
        .then((data) => {
          console.log(data);
          console.log('Data saved!');
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }
  req.flash(
    'success',
    `Nilai untuk ${tanggal.toLocaleDateString()} berhasil dimasukkan`
  );
  return res.redirect('/pilih-kelas');
});

app.get('/konfigurasi-lihat-nilai', isLoggedIn, async (req, res) => {
  const currentUser = await User.findById(req.user._id).populate('kelas');
  res.render('konfigurasiLihatNilai', { currentUser });
});

app.post('/konfigurasi-lihat-nilai', isLoggedIn, async (req, res) => {
  const query = querystring.stringify({
    namaPengajar: req.body.namaPengajar,
    kelasId: req.body.kelas,
    tanggal: req.body.tanggal,
  });
  res.redirect('/lihat-nilai?' + query);
});

app.get('/lihat-nilai', isLoggedIn, async (req, res) => {
  if (Object.keys(req.query).length === 0) {
    req.flash('error', 'Harap konfigurasi pencarian terlebih dahulu');
    return res.redirect('/konfigurasi-lihat-nilai');
  }
  const tanggalDateType = new Date(req.query.tanggal);
  const kelas = await Kelas.findById(req.query.kelasId.trim()).populate(
    'murid'
  );
  for (const murid of kelas.murid) {
    murid.nilai = murid.nilai.filter(
      (score) => score.tanggal.getTime() === tanggalDateType.getTime()
    );
  }
  console.log(kelas.murid[0].nilai[0].jumlahNilai);
  res.render('lihatNilai', {
    murids: kelas.murid,
    namaKelas: kelas['nama-kelas'],
    tanggal: tanggalDateType,
  });
});

app.get('/all-murid-in-kelas/:idKelas', isLoggedIn, async (req, res) => {
  const { idKelas } = req.params;
  if (!idKelas) {
    return res.status(400).send('Harap masukkan id kelas');
  }
  const foundKelas = await Kelas.findById(idKelas)
    .populate('murid')
    .catch((e) => console.log(`error : ${e}`));
  if (Object.keys(foundKelas).length === 0) {
    return res.status(400).send(`Kelas dengan id ${idKelas} tidak ditemukan`);
  }
  res.send(foundKelas);
});

app.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.flash('success', 'Anda berhasil keluar');
  res.redirect('/');
});

app.all('*', (req, res) => {
  res.status(404).send('<h1>TIDAK DITEMUKAN </h1>');
});

const port = 8080;
app.listen(port, () => {
  console.log(`Server hidup di port ${port}`);
});
