const express = require('express')
const bodyParser = require('body-parser')
const {ApolloServer, gql} = require('apollo-server-express')
const cors = require('cors');
const app = express();


const schema = gql`
  type Query {
    hello: String
  }
`

const resolvers = {
  Query: {
     hello(object, params, ctx, resolveInfo){
        return "Hello World!"
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
