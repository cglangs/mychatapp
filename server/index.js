const express = require('express')
const bodyParser = require('body-parser')
const {ApolloServer, gql} = require('apollo-server-express')
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { ACCESS_SECRET, REFRESH_SECRET, getUserId } = require('./utils')
const app = express();
const http = require('http').createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:19006",
    methods: ["GET", "POST"]
  }
});

var connectedUsers = {};


io.on('connection', (socket) => {
  	console.log('a user connected');

  socket.on('registration', (userId) => {
	connectedUsers[userId]= socket.id
  });

   socket.on('chat message', (msg) => {
    io.to(socket.id).emit('chat message', msg);
  });

   socket.on('disconnect', () => {
   	console.log(connectedUsers)
    console.log('user disconnected');
  });

});



http.listen(3001, () => {
  console.log('listening on *:3001');
});


/*

socket.join(uid);
console.log('user ' + socket.user + ' connected \n');
now you can send private message to a user using following line:

io.to(uid).emit();



*/
//TODO Add mongo unique index on user email
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

async function login(object, params, ctx, resolveInfo) {
  const password = params.password
  delete params.password

  const user =  await User.findOne({ email: params.email }).exec();

  if (!user) {
    throw new Error('No such user found')
  }
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    throw new Error('Invalid password')
  }
  user.password = null
  const token = jwt.sign({ userId: user._id, role: user.role }, ACCESS_SECRET)
  return {user, token}
}



const schema = gql`
  type Query {
  	getContacts(userId: String!): [User]
  }
 
  type Mutation {
  	CreateUser(user_name: String! email: String! password: String! role: String! = "STUDENT"): AuthPayload
  	Login(email: String! password: String!): AuthPayload
  }
 
  type User {
  	_id: String!
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
  Query: {
     getContacts: async (object, params, ctx, resolveInfo) => {
        const result = await User.find( { _id: { $ne: params.userId } } )
        return result
      }
    },
   Mutation: {
   	CreateUser(object, params, ctx, resolveInfo) {
   		return signup(object, params, ctx, resolveInfo) 
   	},
   	Login(object, params, ctx, resolveInfo) {
   		return login(object, params, ctx, resolveInfo) 
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
