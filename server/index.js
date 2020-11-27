const express = require('express')
const bodyParser = require('body-parser')
const {ApolloServer, gql} = require('apollo-server-express')
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
mongoose.connect('mongodb://localhost/chatdb', {useNewUrlParser: true});


const hwSchema = new mongoose.Schema({
  hw_string: String
});

const hw = mongoose.model('hw', hwSchema);


const schema = gql`
  type Query {
    hello: String
  }
`

const resolvers = {
  Query: {
     hello: async (object, params, ctx, resolveInfo) => {
        const result = await hw.find({})
        return result[0].hw_string
      }
    }
 }

var corsOptions = {
  origin: 'http://localhost:19006',
  credentials: true // <-- REQUIRED backend setting
};

//app.use(cors(corsOptions));

//app.use(cookieParser())

const server = new ApolloServer({
  introspection: true,
  playground: true,
  typeDefs: schema,
  resolvers,
  context: ({ req }) => {
    return {
      req
    };
  }
});


//server.applyMiddleware({ app });
server.applyMiddleware({ app, cors: corsOptions });


const port = process.env.PORT || 3003;

app.listen({ port: port }, () =>
  console.log(`GraphQL API ready at http://localhost:${port}`)
);
