const { ApolloServer, gql } = require("apollo-server-lambda");
const faunadb = require("faunadb");
const q = faunadb.query;
require("dotenv").config();

const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });

const typeDefs = gql`
type Query {
  bookmarks: [Bookmark!]
}
type Bookmark {
  id: ID!
  desc: String!
  url: String!
}
type Mutation{
  addBookmark(desc: String!, url: String!): Bookmark
  editBookmark(desc: String!, url: String!): Bookmark
}
`

const bookMark = [
  { id: 1, desc: 'Terry Pratchett', url="" },
  { id: 2, desc: 'Stephen King', url="" },
  { id: 3, desc: 'JK Rowling', url="" },
]

const resolvers = {
  Query: {
    bookmarks: (root, args, context) => {
      return bookMark
    },
  },
  Mutation: {
    addBookmark: async(_, {desc, url}, {user}) => {
      if (!user) {
        return "You are not authorized"
      }

    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const handler = server.createHandler()

module.exports = { handler }
