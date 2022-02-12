# Deskripsi
Sebuah website pembelajaran alat peraga untuk siswa kelas 1 SD yang dikembangkan untuk menampilkan data dari mikrokontroller ESP32 melalui sensor MPU6050.

Untuk menggunakan source code ini diperlukan :
1. NodeJs V16.13.0
2. NPM 8.1.3
3. mongoDB
4. MongoDB atlas
5. MongoDB Database Tool Package (untuk import database)

> Untuk meng-install mongo db dapat melihat [Link ini](https://zarkom.net/blogs/how-to-install-mongodb-for-development-in-windows-3328).
> Untuk meng-import database dapat menjalankan perintah ini :
```
mongorestore -d <database_name> <directory_backup>
```
Untuk file kodingan arduino dan file database ada di folder "File tambahan".
Ketika semua software sudah diinstall dan berhasil dijalankan, jalankan perintah ini pada cmd/terminal :
```
npm install
```
```
node index.js
```

Setelah data database berhasil di import dan file arduino berhasil dipasangkan :
1. Jalankan mongodb terlebih dahulu
2. Lalu jalankan perintah ```node index.js```

Seharusnya website jalan pada link 
> http://localhost:8080/
