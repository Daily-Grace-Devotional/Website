const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');
const { graphqlHTTP } = require('express-graphql'); // This one is for Express GraphQL
const schema = require('./graphql-schema');
const resolvers = require('./resolvers');
const Admin = require('./models/admin_model')
const routers = require('./router/router');
const bcrypt = require('bcrypt');
require('dotenv').config();
const path = require('path');
// const httpProxy = require('http-proxy');
require('./connection');

const app = express();
app.use(cors({
  origin: true, // Replace with actual IP
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allow specific headers
}));
app.use(express.json()); // Do this So that my server can accept json
app.use(express.urlencoded({ extended: true }));
// const proxy = httpProxy.createProxyServer();

// app.all('/*', (req, res) => {
//   proxy.web(req, res, { target: 'http://104.236.193.57:4000' });
// });


// Router for my uploads and stuffs
app.use('/', routers);
app.use('/devotion_thumbnail', express.static(path.join(__dirname, '../react/build/devotion_thumbnail')));
app.use('/devotion_audio', express.static(path.join(__dirname, '../react/build/devotion_audio')));
console.log("Current SERVER directory", __dirname);



const strength = 10; // Higher number is higher hashing strength
const password = 'Devotion@2024';

(async () => {
  try {
    const hashedPassword = await bcrypt.hash(password, strength);

    const userData = {
      username: 'admin',
      password: hashedPassword,
    };

    const newAdmin = new Admin(userData);
    const savedAdmin = await newAdmin.save();

    console.log('User record successfully saved:', savedAdmin);
  } catch (error) {
    console.error(error);
  }
})();

const server = new ApolloServer({
  typeDefs: schema,
  resolvers: resolvers,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

async function startApolloServer() {
  await server.start();
  server.applyMiddleware({ app, path: '/graphql-server' });
}

startApolloServer();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Graphql server listening on port ${PORT}`);
});



// const functions = require('firebase-functions');
// const express = require('express');
// const cors = require('cors');
// const app = express();
// app.use(cors());

// const server = require('./server');

// exports.app = functions.https.onRequest(server.graphql);
