const {ApolloServer} = require('@apollo/server');
const {startStandaloneServer} = require('@apollo/server/standalone');

// GraphQL schema definition: types, queries, and mutation operations.
const typeDefs = `#graphql

type User {
  id: ID!
  name: String!
  age: Int!
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
}

type Mutation {
    addUser(
    name: String!, 
    age: Int!
    ): User!

    addPost(
    title: String!, 
    content: String!, 
    authorId: ID!
    ): Post!
}

type Query {
  users: [User!]!
  posts: [Post!]!
  user(id: ID!): User
  post(id: ID!): Post
}
`;

// In-memory user data used by the GraphQL resolvers.
const users = [
  {
    id: "1",
    name: "Akash",
    age: 30,
  },
  {
    id: "2",
    name: "Rahul",
    age: 25,
  },
  {
    id: "3",
    name: "Priya",
    age: 28,
  },
];

// In-memory post data with author references.
const posts = [
  {
    id: "101",
    title: "Learning GraphQL",
    content: "GraphQL is awesome",
    authorId: "1",
  },
  {
    id: "102",
    title: "NodeJS Basics",
    content: "Learning Node",
    authorId: "1",
  },
  {
    id: "103",
    title: "JavaScript Tips",
    content: "Useful JS tricks",
    authorId: "2",
  },
];

// Resolver implementations for Query, Mutation, and type relationships.
const resolvers = {
  Query: {
    // Return all users from the in-memory dataset.
    users: () => users,
    // Find a single user by ID.
    user: (_, args) => users.find(user => user.id === args.id),
    // Return all posts from the in-memory dataset.
    posts: () => posts,
    // Find a single post by ID.
    post: (_, args) => posts.find(post => post.id === args.id),
  },
  Mutation: {
    // Create and return a new user, storing it in the local array.
    addUser: (_, args) => {
      const newUser = {
        id: String(users.length + 1),
        name: args.name,
        age: args.age,
      };
      users.push(newUser);
      return newUser;
    },
    // Create and return a new post, storing it in the local array.
    addPost: (_, args) => {
      const newPost = {
        id: String(posts.length + 1),
        title: args.title,
        content: args.content,
        authorId: args.authorId,
      };
      posts.push(newPost);
      return newPost;
    },
  },
  User: {
    // Resolve the posts field for a User by filtering posts by authorId.
    posts: (parent) => posts.filter(
      post => post.authorId === parent.id
    ),
  },
  Post: {
    // Resolve the author field for a Post by finding the matching user.
    author: (parent) => users.find(user => user.id === parent.authorId),
  },
};

// Start the Apollo Server on port 4000 and log the URL once ready.
async function startServer() {
  const server = new ApolloServer({typeDefs, resolvers});
    const {url} = await startStandaloneServer(server, {
        listen: {port: 4000},
    });
    console.log(`🚀 Server ready at ${url}`);
}

startServer();