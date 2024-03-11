Instagram Node.js ile APK Mirror üzerinden, Instagram uygulamasına ait son 10 APK dağıtımını, beta ve alfa
sürümlerini dahil etmeden, release tarihlerini de ekleyerek, varyantları ile birlikte çeken uygulama
-------------------------------------------------------------------------------------------------------------

Bu projede axios ve cheerio ve express kütüphaneleri kullanıldı kodun içeriğinden bahsedecek olursak

RetriveData.js :
--------------
 Apk sayfasından veri çekmek  ve bu verileri MongoDB'ye eklemek veya güncellemek için kullanılır. İşte adım adım ne yaptığı:
1.	Axios, cheerio ve mongodb modülleri import edilir. Axios, HTTP istekleri yapmak için kullanılır. Cheerio, HTML belgelerini ayrıştırmak ve jQuery benzeri bir API ile bu belgeler üzerinde çalışmak için kullanılır. Mongodb, MongoDB veritabanları ile etkileşim kurmak için kullanılır.
2.	fetchData adında bir fonksiyon tanımlanır. Bu fonksiyon, belirtilen URL'den veri çeker. Veri, HTML belgesi olarak döner ve cheerio ile ayrıştırılır. Ayrıştırılan HTML belgesinden belirli veriler çekilir ve bir diziye eklenir.
3.	fetchVariantDetails adında bir fonksiyon tanımlanır. Bu fonksiyon, belirtilen URL'den varyant detaylarını çeker. Varyant detayları, HTML belgesi olarak döner ve cheerio ile ayrıştırılır. Ayrıştırılan HTML belgesinden belirli veriler çekilir ve bir diziye eklenir.
4.	addOrUpdateDataInMongoDB adında bir fonksiyon tanımlanır. Bu fonksiyon, verileri MongoDB'ye ekler veya günceller. Veriler, MongoDB'ye eklenirken veya güncellenirken belirli bir filtre kullanılır. Filtre, verinin versionLink özelliğine göre belirlenir.
5.	Son olarak, bu fonksiyonlar dışarıya aktarılır (export edilir) ve başka dosyalarda kullanılabilir hale getirilir.
6.	
Kütüphanelerin kullanılma nedenleri:
•	Axios: HTTP istekleri yapmak için kullanılır. Bu kodda, belirli bir URL'den HTML belgesi çekmek için kullanılır.
•	Cheerio: HTML belgelerini ayrıştırmak ve bu belgeler üzerinde çalışmak için kullanılır. Bu kodda, çekilen HTML belgesinden belirli verileri çekmek için kullanılır.
•	Mongodb: MongoDB veritabanları ile etkileşim kurmak için kullanılır. Bu kodda, verileri MongoDB'ye eklemek veya güncellemek için kullanılır.


app.js : 
-------
Express.js kullanarak bir web sunucusu oluşturur ve MongoDB Realm ile veri alışverişi yapar. İşte adım adım ne yaptığı:
1.	Express.js, axios ve body-parser modülleri import edilir. Express.js, web sunucusu oluşturmak için kullanılır. Axios, HTTP istekleri yapmak için kullanılır. Body-parser, gelen isteklerin gövdelerini ayrıştırmak için kullanılır.
2.	Express.js uygulaması oluşturulur ve body-parser'ın JSON ayrıştırıcısı kullanılır.
3.	MongoDB Realm bağlantı detayları belirlenir.
4.	makeRealmRequest adında bir fonksiyon tanımlanır. Bu fonksiyon, MongoDB Realm'e HTTP istekleri yapar. İstek türü, uç nokta ve gönderilecek veri parametre olarak alınır.
5.	Çeşitli HTTP istek türlerine karşılık gelen Express.js yol işleyicileri tanımlanır. Bunlar:
•	GET /data: Tüm verileri çeker.
•	GET /data/:versionID: Belirli bir versionID'ye sahip veriyi çeker.
•	POST /data: Yeni bir veri ekler.
•	PUT /data/:id: Belirli bir ID'ye sahip veriyi günceller.
•	DELETE /data/:versionID: Belirli bir versionID'ye sahip veriyi siler.
6.	Son olarak, uygulama belirtilen portta dinlemeye başlar.
Her bir yol işleyici, MongoDB Realm'e bir istek yapar ve sonucu yanıt olarak döndürür. Hatalar yakalanır ve hata mesajı yanıt olarak gönderilir.

![Ekran Alıntısı](https://github.com/jonhonpony/NodeJs-web-Scrapper-mongoDB/assets/75491423/4fcc6a5a-ca94-4dd1-a897-a9612ffdfaa6)



server.js:
----------
bir web sunucusu oluşturur ve belirli bir URL'den veri çeker, ardından bu verileri MongoDB'ye ekler veya günceller. İşte adım adım ne yaptığı:
1.	Gerekli modüller import edilir. Bunlar http, app.js, mongoConnection ve RetriveData modülleri. Http, bir web sunucusu oluşturmak için kullanılır. App.js, Express.js uygulamasını içerir. MongoConnection, MongoDB'ye bağlanmak ve bağlantıyı kapatmak için kullanılır. RetriveData, bir web sayfasından veri çekmek ve bu verileri MongoDB'ye eklemek veya güncellemek için kullanılır.
2.	Port numarası belirlenir. Port numarası, çevre değişkeninden alınır. Eğer çevre değişkeninde port numarası belirtilmemişse, 1337 portu kullanılır.
3.	run adında bir asenkron fonksiyon tanımlanır. Bu fonksiyon, MongoDB'ye bağlanır, belirli bir URL'den veri çeker, bu verileri MongoDB'ye ekler veya günceller ve son olarak MongoDB bağlantısını kapatır.
4.	run fonksiyonu çağrılır. Eğer bir hata oluşursa, hata konsola yazdırılır.
5.	Bir web sunucusu oluşturulur. Bu sunucu, gelen her isteğe 'Hello World\n' yanıtını döndürür. Sunucu, belirlenen portta dinlemeye başlar.
Bu dosya, bir web sunucusu oluşturmanın yanı sıra, belirli bir URL'den veri çekme ve bu verileri MongoDB'ye eklemek veya güncellemek gibi işlemleri gerçekleştirir. Bu işlemler, sunucu başlatıldığında bir kez gerçekleştirilir.




