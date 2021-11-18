const express = require("express");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const path = require("path");
const session = require("express-session");
const ejsMate = require("ejs-mate");
const app = express();

const sessionConfig = {
  secret: "secret",
  store: MongoStore.create({
    mongoUrl: "mongodb://localhost:27017/pendidikan",
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
  .connect("mongodb://yovan:123456@localhost:27017/?authSource=webta")
  .then(() => {
    console.log("koneksi sukses ke Database port 27017 Sukses");
  })
  .catch((e) => {
    console.log(`koneksike data base tidak berhasil : ${e}`);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(session(sessionConfig));
app.use(express.static(path.join(__dirname, "node_modules/bootstrap/dist")));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/konfigurasi", (req, res) => {
  res.render("konfigurasi");
});

app.all("*", (req, res) => {
  res.status(404).send("<h1>TIDAK DITEMUKAN </h1>");
});

const port = 8080;
app.listen(port, () => {
  console.log(`Server hidup di port ${port}`);
});
