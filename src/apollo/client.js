const React = require("react");
const {setContext} = require('apollo-link-context');
const netlifyIdentity = require("netlify-identity-widget");
const fetch = require('cross-fetch');

const {
  ApolloClient,
  HttpLink,
  InMemoryCache,
} = require("@apollo/client");

const authLink = setContext((_, {headers}) => {
  const user = netlifyIdentity.currentUser();

  const token =  user.token.access_token;

  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}`: ''
    }
  }
})

const httpLink = new HttpLink({
  uri: "/.netlify/functions/bookmarks",
  fetch
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink)
})