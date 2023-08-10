const url = 'mongodb://localhost:27017';
const databaseName = 'music';
const { MongoClient } = require('mongodb');
const connectToDatabase = (callback) => {
    MongoClient.connect(url, (error, client) => {
      if (error) {
        console.error('Unable to connect to the database:', error);
        return;
      }
  
      const db = client.db(databaseName);
      callback(db);
  
      client.close();
    });
  };
  
  module.exports = connectToDatabase;
