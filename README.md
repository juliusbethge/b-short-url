# b-short-url

## Overview
b-short-url is a serverless url shortener that is built for firebase. It uses different firebase services (Cloud Functions, Hosting and Firestore) to take advantage of be benefits that come with a serverless architecture: The set up process is pretty straight forward and the scaling and maintenance is done completely by Google.

### Url generation
To generate new short urls, b-short-url uses the hash function *MD5*. This results in the fact that the same url is converted into the same short url every time. One problem using this approach is called collision. This means the fact that multiple urls (inputs) convert to the same short url (hash). In this case the user would not be able to create a short url if the corresponding hash is already used by another url.

To get a small url, b-short-url shortens the md5-hash (formatted in base64) to a specified length. This means it is possible to store up to 64^*length_of_hash* urls in the database. For example you can store up to 1,073,741,824 urls when setting the length to 5. The higher you set the length of the hash in the shortened url the smaller is the probability to experience collision issues while using b-short-url.

**NOTE:** Lern how to configure the length of the hash in the short url here. TODO

### Backend
The backend consists of two parts:
- adding urls and redirecting from the short url to the original one is handled by two *Firebase Cloud Functions*
- that add to and read from a document based *Firestore database*.

### Frontend
The frontend is based on a *React JS web app* that is hosted via *Firebase Hosting*.