import firebase from 'firebase';

const settings = {timestampsInSnapshots: true};

const config = {
    projectId = 'dev-chat-44389',
    apiKey: '',
    databaseURL: 'https://dev-chat-44389-default-rtdb.firebaseio.com',
}

firebase.initializeApp(config);

export default firebase;