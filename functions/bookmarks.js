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
  name: String!
  url: String!
}
type Mutation{
  addBookmark(name: String!, url: String!): Bookmark
  editBookmark(id: ID!, name: String!, url: String!): Bookmark
  delBookmark(id: ID!): Bookmark
}
`

const resolvers = {
  Query: {
    bookmarks: async (parent, args, { user }) => {
      if (!user) {
        return [];
      } else {
        const results = await client.query(
          q.Paginate(q.Match(q.Index("user_bookmark"), user))
        );
        return results.data.map(([ref, name, url]) => {
          return {
            id: ref.id,
            name,
            url,
          };
        });
      }
    },
  },
  Mutation: {
    delBookmark: async (_, { id }, { user }) => {
      if (!user) {
        throw new Error("You are not authorized;")
      }
      const results = await client.query(
        q.Delete(q.Ref(q.Collection('bookmark'), id))
      )
    },

    addBookmark: async (_, { name, url }, { user }) => {
      if (!user) {
        return "You are not authorized"
      }
      const results = await client.query(
        q.Create(q.Collection("bookmark"), {
          data: {
            name,
            owner: user,
            url,
          },
        })
      );
      return {
        ...results.data,
        id: results.ref.id,
      };
    },

    editBookmark: async (_, { id, url, name }, { user }) => {
      if (!user) {
        throw new Error("Must be authenticated to add bookmarks");
      }
      const results = await client.query(
        q.Update(q.Ref(q.Collection("bookmark"), id), {
          data: {
            name,
            url,
          },
        })
      );
      return {
        ...results.data,
        id: results.ref.id,
      };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ context }) => {
    if (context.clientContext.user) {
      return { user: context.clientContext.user.sub };
    } else {
      return {};
    }
  },
});
exports.handler = server.createHandler({
  cors: {
    origin: "*",
    credentials: true,
  },
});
