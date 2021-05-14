require("dotenv").config();
const faunadb = require("faunadb");
const q = faunadb.query;

const { ApolloServer, gql } = require("apollo-server-lambda");

const typeDefs = gql`
  type Query {
    bookmarks: [Bookmark!]
  }
  type Mutation {
    addBookmark(name: String!, url: String!): Bookmark
    editBookmark(name: String!, url: String!, id: ID!): Bookmark
    delBookmark(id: ID!): Bookmark
  }
  type Bookmark {
    id: ID!
    name: String!
    url: String!
    owner: String!
  }
`;

const resolvers = {
  Query: {
    bookmarks: async (parent, args, { user }) => {
      try {
        if (!user) return [];
        else {
          if (process.env.FAUNADB_SECRET) {
            var client = new faunadb.Client({
              secret: process.env.FAUNADB_SECRET,
            });

            const result = await client.query(
              q.Paginate(q.Match(q.Index("user_bookmark"), user))
            );
            return result.data.map(([ref, name, url]) => {
              return {
                id: ref.id,
                name: name,
                url: url,
              };
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  Mutation: {
    editBookmark: async (_, { name, url, id }, { user }) => {
      if (!user) throw new Error("Must be authenticated to edit");
      try {
        var client = new faunadb.Client({
          secret: process.env.FAUNADB_SECRET,
        });

        const result = await client.query(
          q.Update(q.Ref(q.Collection("bookmark"), id), {
            data: {
              name: name,
              url: url,
            },
          })
        );

      } catch (err) {
        console.log(err);
      }
    },
    delBookmark: async (_, { id }, { user }) => {
      if (!user) throw new Error("Must be authenticated to edit");
      try {
        var client = new faunadb.Client({
          secret: process.env.FAUNADB_SECRET,
        });

        const result = await client.query(
          q.Delete(q.Ref(q.Collection("bookmark"), id))
        );

      } catch (err) {
        console.log(err);
      }
    },
    addBookmark: async (_, { name, url }, { user }) => {
      if (!user) {
        throw new Error("Must be authenticated to insert todos");
      }
      try {
        var client = new faunadb.Client({
          secret: process.env.FAUNADB_SECRET,
        });

        const result = await client.query(
          q.Create(q.Collection("bookmark"), {
            data: {
              name: name,
              url: url,
              owner: user,
            },
          })
        );

        return {
          name: result.data.name,
          url: result.data.url,
        };
      } catch (err) {
        console.log(err);
      }
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

const handler = server.createHandler();

module.exports = { handler };