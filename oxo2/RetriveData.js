const axios = require('axios');
const cheerio = require('cheerio');
const { MongoClient, ServerApiVersion } = require('mongodb');

async function fetchData(url) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        // appRow class'ýna sahip div'leri çekme iþlemi
        const appRowDivs = $('.appRow');

        // apk ilk 10 verisini çekme iþlemi
        const first10AppRowDivs = appRowDivs.slice(0, 10);

        // apk varyant, versiyon, tarih, link, varyant sayýsý gibi verileri çekme iþlemi
        const data = await Promise.all(first10AppRowDivs.map(async (index, element) => {
            const versionLink = `https://www.apkmirror.com${$(element).find('.appRowTitle a').attr('href')}`;
            let versionIDRaw = $(element).find('.appRowTitle a').text().trim();

            
            let versionID = versionIDRaw.replace(/\b(beta|alpha)\b/gi, '').trim();

            
            versionID = versionID.replace(/Instagram/gi, '').trim();
            const releaseDate = $(element).find('.dateyear_utc').text().trim();
            const variantCount = $(element).find('.appRowVariantTag ').text().trim();

            
            const variantDetails = await fetchVariantDetails(versionLink);

            return {
                versionLink,
                versionID,
                releaseDate,
                variantCount,
                variantDetails 
            };
        }).get());

        return data;
    } catch (error) {
        console.error('Veri çekme hatasý:', error.message);
        throw error;
    }
}


async function fetchVariantDetails(versionLink) {
    try {
        const response = await axios.get(versionLink);
        const $ = cheerio.load(response.data);

        const variantDetails = $('.variants-table .table-row').map((index, element) => {
            const variantId = $(element).find('.colorLightBlack').text().trim();
            const architecture = $(element).find('.table-cell').eq(1).text().trim();
            const minAndroidVersion = $(element).find('.table-cell').eq(2).text().trim();
            const dpi = $(element).find('.table-cell').eq(3).text().trim();

            return {
                variantId,
                architecture,
                minAndroidVersion,
                dpi
            };
        }).get();

        return variantDetails;
    } catch (error) {
        console.error('Varyant detaylarý çekme hatasý:', error.message);
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