// server.js

'use strict';
const http = require('http');
const { connectToMongoDB, closeMongoDBConnection } = require('./mongoConnection');
const { fetchData, addOrUpdateDataInMongoDB } = require('./RetriveData');

const port = process.env.PORT || 1337;


async function run() {
    await connectToMongoDB();

    // Veriyi MongoDB'ye ekleyerek iþlemi gerçekleþtir
    const url = 'https://www.apkmirror.com/apk/instagram/instagram-instagram/';
    const dbName = 'OXO_inst'; // MongoDB veritabaný adýnýzý buraya ekleyin
    const collectionName = 'database'; // MongoDB koleksiyon adýnýzý buraya ekleyin

    // fetchData fonksiyonu aracýlýðýyla verileri çek
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