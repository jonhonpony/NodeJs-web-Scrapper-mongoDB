// server.js

'use strict';
const http = require('http');
const { connectToMongoDB, closeMongoDBConnection } = require('./mongoConnection');
const { fetchData, addOrUpdateDataInMongoDB } = require('./RetriveData');

const port = process.env.PORT || 1337;


async function run() {
    await connectToMongoDB();

    // Veriyi MongoDB'ye ekleyerek i�lemi ger�ekle�tir
    const url = 'https://www.apkmirror.com/apk/instagram/instagram-instagram/';
    const dbName = 'OXO_inst'; // MongoDB veritaban� ad�n�z� buraya ekleyin
    const collectionName = 'database'; // MongoDB koleksiyon ad�n�z� buraya ekleyin

    // fetchData fonksiyonu arac�l���yla verileri �ek
    const data = await fetchData(url);

    // MongoDB'ye veriyi ekleme
    await addOrUpdateDataInMongoDB(data, dbName, collectionName);

    await closeMongoDBConnection();
}

run().catch(console.dir);

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World\n');
}).listen(port);