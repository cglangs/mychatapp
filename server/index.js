const express = require('express')
const bodyParser = require('body-parser')
const {ApolloServer, gql} = = require('apollo-server-express')
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
  origin: 'http://localhost:3000',
  credentials: true // <-- REQUIRED backend setting
};

app.use(cors(corsOptions));

//app.use(cookieParser())


const server = new ApolloServer({
  introspection: true,
  playground: true,
  typeDefs: schema,
  context: ({ req }) => {
    return {
      models,
      req
    };
  }
});


server.applyMiddleware({ app });

const port = process.env.PORT || 3003;

app.listen({ port: port }, () =>
  console.log(`GraphQL API ready at http://localhost:${port}`)
);
