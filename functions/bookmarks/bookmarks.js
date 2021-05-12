const { ApolloServer, gql } = require("apollo-server-lambda");
const faunadb = require("faunadb");
const q = faunadb.query;
require("dotenv").config();

var objToday = new Date(),
  weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayOfWeek = weekday[objToday.getDay()],
  dayOfMonth = objToday.getDate(),
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  curMonth = months[objToday.getMonth()],
  curYear = objToday.getFullYear(),
  curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours()),
  curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes(),
  curSeconds = objToday.getSeconds() < 10 ? "0" + objToday.getSeconds() : objToday.getSeconds()

var today = curHour + ":" + curMinute + "." + curSeconds + " " + dayOfWeek.substring(0, 3) + " " + curMonth.substring(0, 3) + " " + dayOfMonth + " " + curYear;

const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });

const typeDefs = gql`
type Query {
  bookmarks: [Bookmark!]
}
type Bookmark {
  id: ID!
  desc: String!
  url: String!
  date: String!
}
`

const bookMark = [
  { id: 1, dec: 'Terry Pratchett', url="", date="" },
  { id: 2, dec: 'Stephen King', url="", date="" },
  { id: 3, dec: 'JK Rowling', url="", date="" },
]

const resolvers = {
  Query: {
    bookmarks: (root, args, context) => {
      return bookMark
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const handler = server.createHandler()

module.exports = { handler }
