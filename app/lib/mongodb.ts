//@ts-nocheck

import { MongoClient } from 'mongodb';

const uri = 'mongodb://jawadakhter7:wxniB4aK9PAYJR5Y@ac-uqql9vi-shard-00-00.wrxrpup.mongodb.net:27017,ac-uqql9vi-shard-00-01.wrxrpup.mongodb.net:27017,ac-uqql9vi-shard-00-02.wrxrpup.mongodb.net:27017/?replicaSet=atlas-vmcs2r-shard-0&ssl=true&authSource=admin';
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export default clientPromise;
