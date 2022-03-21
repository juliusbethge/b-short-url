# b-short-url

## Overview
b-short-url is a serverless url shortener that is built with firebase. It uses different firebase services (Cloud Functions, Hosting, Firestore) to take advantage of the benefits that come with a serverless architecture: The setup process is pretty straight forward and the scaling and maintenance are done completely by Google.

### Url generation
To generate new short urls, b-short-url uses the hash function *MD5*. This results in the fact that the same url is converted into the same short url every time. One problem using this approach is called collision. This means that multiple urls (inputs) convert to the same short url (hash). In this case, the user would not be able to create a short url if the corresponding hash is already used by another url.

To get a small url, b-short-url shortens the md5-hash (formatted in base64) to a specified length. This means it is possible to store up to 64^*length_of_hash* urls in the database. For example, you can store up to 1,073,741,824 urls when setting the length to 5. The higher you set the length of the hash in the shortened url the smaller is the probability to experience collision issues while using b-short-url.

**NOTE:** Learn how to configure the length of the hash in the short url [here](#initialization).

### Backend
The backend consists of two parts:
- adding urls and redirecting from the short url to the original one is handled by two *Firebase Cloud Functions*
- that add to and read from a document-based *Firestore database*.

### Frontend
The frontend is based on a *React JS web app* that is hosted via *Firebase Hosting*.

## Setup

### Firebase configuration
1. At first you need to go to the [Firebase console](https://console.firebase.google.com/) and create a new project.
   
2. When your project is created, upgrade to the *Blaze Plan*. (This is needed for *Cloud Functions*.)
   
3. Create a new *Firestore database* for your project.
   
4. Change the Security Rules for the database to:
   ```
   rules_version = '2';
   service cloud.firestore {
       match /databases/{database}/documents {
           match /{document=**} {
               allow read: if true;
           }
       }
   }
   ```
   This guarantees that you will be able to read the generated urls from the database from the frontend. As you can see, the write-access is disabled. We do not need to enable it because the writing will be handled by the Cloud Functions, which have unrestricted access to the database no matter what.

5. Enable Firebase Hosting. You do not need to do the following installation steps.
   **OPTIONAL:** Configure your custom domain if you do not want to use the default one.

6. Add a web app to your project and save the firebase config object. You will need it in the next section.

### Initialization
1. Copy the files from this repository to your system.

2. Open the directory in your terminal and run:
   ```console
   firebase init
   ```
   Select *Cloud Functions* and *Hosting*. Connect it to the Firebase project you created in [Firebase configuration](#firebase-configuration). Stay with the default answers for the following questions but make sure to select `build` as your public directory.

3. Next run the command:
   ```console
   npm install
   ```
   This will download and install all the needed dependencies for the frontend React App.

4. Save the firebase config object as `firebase-config.json` in `src/firebase`.

5. Create a `.env` file in the `functions` directory and add the following lines:
   ```shell
   DEFAULT_WEBSITE_URL=<HOSTING_URL>
   LENGTH_OF_SHORT_URL=<LENGTH_OF_THE_HASH>
   ```
   The `<HOSTING_URL>` should be the domain configured in *Firebase Hosting*.
   You can choose the `<LENGTH_OF_THE_HASH>` in the short url. The maximum length is 22.

6. Go to the `firebase.json` file in the root directory. Under `hosting`, add the following lines:
   ```json
   "redirects": [
      {
        "regex": "^/(?P<shortHash>[A-Za-z0-9+/]+)$",
        "destination": "<OPEN_LINK_FUNCTION_URL>/:shortHash",
        "type": 301
      }
    ]
   ``` 
   The regular expression will look for the hash added to the base url in `base64`. This will prevent the redirects for requests intended to get the `favicon` or the `robots.txt`. Of course, you can limit the regex to the length you specified in the `.env` file above.
   Replace the `<OPEN_LINK_FUNCTION_URL>` with the url to the openLink function. You need to deploy the functions first to see the right function url. If you do not want to deploy the functions first, the url should look like this: `https://europe-west1-<YOUR_UNIQUE_PROJECT_ID>.cloudfunctions.net/openLink`.

### Deployment
1. Before you can deploy the project to *Firebase*, you need to run:
   ```console
   npm run build
   ```
   This will build the React App in the `build` folder.

2. To deploy the project just run the following command:
   ```console
   firebase deploy
   ```

Your very own url shortener should now be available on the url configured in *Firebase Hosting*!
