// mongoConnection.js

const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://avsaratakan12:firenze571571@cluster0.on1bys2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function connectToMongoDB() {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        // Ba�lant� ba�ar�l� oldu�unda koleksiyon varl���n� kontrol ettikten sonra koleksiyonu olu�tur
        const dbName = "OXO_inst"; // Veritaban� ad�n� g�ncelle
        const collectionName = "database"; // Koleksiyon ad�n� g�ncelle

        const db = client.db(dbName);
        const collections = await db.listCollections({ name: collectionName }).toArray();

        if (collections.length === 0) {
            // Koleksiyon yoksa, koleksiyonu olu�tur
            await db.createCollection(collectionName);
            console.log(`'${collectionName}' koleksiyonu olu�turuldu.`);
        } else {
            console.log(`'${collectionName}' koleksiyonu zaten var.`);
        }

    } catch (error) {
        console.error('MongoDB ba�lant� hatas�:', error.message);
    }
}

async function closeMongoDBConnection() {
    try {
        await client.close();
        console.log("MongoDB ba�lant�s� kapat�ld�.");
    } catch (error) {
        console.error('MongoDB ba�lant� kapatma hatas�:', error.message);
    }
}

module.exports = {
    connectToMongoDB,
    closeMongoDBConnection
};
