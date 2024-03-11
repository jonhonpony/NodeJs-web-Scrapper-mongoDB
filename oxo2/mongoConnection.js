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

        // Baðlantý baþarýlý olduðunda koleksiyon varlýðýný kontrol ettikten sonra koleksiyonu oluþtur
        const dbName = "OXO_inst"; // Veritabaný adýný güncelle
        const collectionName = "database"; // Koleksiyon adýný güncelle

        const db = client.db(dbName);
        const collections = await db.listCollections({ name: collectionName }).toArray();

        if (collections.length === 0) {
            // Koleksiyon yoksa, koleksiyonu oluþtur
            await db.createCollection(collectionName);
            console.log(`'${collectionName}' koleksiyonu oluþturuldu.`);
        } else {
            console.log(`'${collectionName}' koleksiyonu zaten var.`);
        }

    } catch (error) {
        console.error('MongoDB baðlantý hatasý:', error.message);
    }
}

async function closeMongoDBConnection() {
    try {
        await client.close();
        console.log("MongoDB baðlantýsý kapatýldý.");
    } catch (error) {
        console.error('MongoDB baðlantý kapatma hatasý:', error.message);
    }
}

module.exports = {
    connectToMongoDB,
    closeMongoDBConnection
};
