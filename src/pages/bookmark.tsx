import React, { useContext } from 'react';
import { IdentityContext } from "../../netlifyIdentityContext";
import Layout from '../components/layout';
import SEO from '../components/seo';
import LogInButton from '../components/Login';
import BookmarkList from '../components/BookmarkList';

const LoggedOut = () => {

  return (
    <Layout>
      <SEO title="Home" />
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <h1>Create Bookmarks</h1>
        <p>You are not logged In.</p>
        <p>LogIn to create Bookmarks</p>
        <LogInButton />
      </div>
    </Layout>
  )
}

const todo = () => {
  const { user } = useContext(IdentityContext);
  if (!user) {
    return (
      <LoggedOut />
    );
  }
  else {
    return (
      <BookmarkList />
    )
  }
}

export default todo;