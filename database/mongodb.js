import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

// check the MongoDB URI
if (!MONGODB_URI) {
    throw new Error('Define the MONGODB_URI environmental variable');
}

// check the MongoDB DB
if (!MONGODB_DB) {
    throw new Error('Define the MONGODB_DB environmental variable');
}

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
    // check the cached.
    if (cachedClient && cachedDb) {
        // load from cache
        return {
            client: cachedClient,
            db: cachedDb,
        };
    }

    // set the connection options
    const opts = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // maxPoolSize default is  5
        // We set limiting maximum connection pool size so MongoDB Atlas won't complain we are using near 500 conns.
        // Somehow default is not enforced and it was opening lots of conns when heavy GET request from dev environ debuging 
        // and from JMeter testing. New param maxPoolSize does it even for 1000 threads Ramp-up 1 loops 2 of simple
        // /api/servercompanies/country='CAN' returning 4 records, it opened like 58 max conns)
        maxPoolSize: 50, 
    };

    // Connect to cluster
    let client = new MongoClient(MONGODB_URI, opts);
    await client.connect();
    let db = client.db(MONGODB_DB);

    // set cache
    cachedClient = client;
    cachedDb = db;

    return {
        client: cachedClient,
        db: cachedDb,
    };
}