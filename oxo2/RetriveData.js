const axios = require('axios');
const cheerio = require('cheerio');
const { MongoClient, ServerApiVersion } = require('mongodb');

async function fetchData(url) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        // Selecting div elements with class 'appRow'
        const appRowDivs = $('.appRow');

        // Taking only the first 10 items
        const first10AppRowDivs = appRowDivs.slice(0, 10);

        // Extracting information for each item in first10AppRowDivs
        const data = first10AppRowDivs.map((index, element) => {
            const versionLink = `https://www.apkmirror.com${$(element).find('.appRowTitle a').attr('href')}`;
            const versionName = $(element).find('.appRowTitle a').text().trim();
            const releaseDate = $(element).find('.dateyear_utc').text().trim();
            const variantCount = $(element).find('.appRowVariantTag ').text().trim();

            return {
                versionLink,
                versionName,
                releaseDate,
                variantCount
            };
        }).get();

        return data;
    } catch (error) {
        console.error('Veri çekme hatasý:', error.message);
        throw error;
    }
}


async function addOrUpdateDataInMongoDB(data, dbName, collectionName) {
    const uri = "mongodb+srv://avsaratakan12:firenze571571@cluster0.on1bys2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    try {
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // MongoDB'de veriyi güncelleme veya ekleme
        for (let item of data) {
            await collection.findOneAndUpdate(
                { versionLink: item.versionLink }, // filter
                { $set: item }, // update
                { upsert: true } // options
            );
        }

        console.log('Veri MongoDB\'ye baþarýyla eklendi veya güncellendi.');
    } catch (error) {
        console.error('MongoDB\'ye veri ekleme veya güncelleme hatasý:', error.message);
        throw error;
    } finally {
        await client.close();
    }
}


module.exports = {
    fetchData,
    addOrUpdateDataInMongoDB
};
