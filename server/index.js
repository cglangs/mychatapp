const express = require('express')
const bodyParser = require('body-parser')
const {ApolloServer, gql} = require('apollo-server-express')
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { ACCESS_SECRET, REFRESH_SECRET, getUserId } = require('./utils')


const app = express();
mongoose.connect('mongodb://localhost/mychatdb', {useNewUrlParser: true});


const userSchema = new mongoose.Schema({
  user_name: String,
  password: String,
  email: String,
  role: String
});

const User = mongoose.model('User', userSchema);


async function signup(object, params, ctx, resolveInfo) {
  params.password = await bcrypt.hash(params.password, 10)
  const newUser = new User({ user_name: params.user_name, email: params.email, password: params.password, role: params.role })
  var user
  
  try{
  	user = await newUser.save()
  	const token = jwt.sign({ userId: user._id, role: user.role }, ACCESS_SECRET)
    return {user, token}
  }  
  catch(error){
  	console.log(error)
    throw new Error("Email address already in use")
  }
}

/*async function login(object, params, ctx, resolveInfo) {
  const password = params.password
  delete params.password

  const user = await ctx.models.users.findOne({
  where: {
    user_email: params.email
  }
  })

  if (!user) {
    throw new Error('No such user found')
  }
  const valid = await bcrypt.compare(password, user.user_password)
  if (!valid) {
    throw new Error('Invalid password')
  }
  user.password = null

  ctx.req.res.cookie("refresh-token", jwt.sign({ userId: user.user_id, role: user.user_role }, REFRESH_SECRET), { maxAge: 7 * 60 * 60 * 1000 })
  ctx.req.res.cookie("access-token", jwt.sign({ userId: user.user_id, role: user.user_role }, ACCESS_SECRET), { maxAge: 15 * 60 * 1000 })
  return user
}
async function getMe(object, params, ctx, resolveInfo) {
  const user = await ctx.models.users.findOne({
  where: {
    user_id: params.user_id
  }
  })

  if (!user) {
    throw new Error('Error')
  }

  return user
}*/



const schema = gql`
  type Query {
  	me: User
  }
 
  type Mutation {
  	CreateUser(user_name: String! email: String! password: String! role: String! = "STUDENT"): AuthPayload
  	Login(email: String! password: String!): User
  }
 
  type User {
  	user_name: String!
  	email: String!
  	password: String!
  	role: String!
  }

  type AuthPayload{
  	token: String!
  	user: User!
  }

`

const resolvers = {
  /*Query: {
     hello: async (object, params, ctx, resolveInfo) => {
        const result = await hw.find({})
        return result[0].hw_string
      }
    }*/
   Mutation: {
   	CreateUser(object, params, ctx, resolveInfo) {
   		return signup(object, params, ctx, resolveInfo) 
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
