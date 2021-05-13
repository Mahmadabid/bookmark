import React, { useContext } from 'react'
import Layout from '../components/layout';
import SEO from '../components/seo';
import { IdentityContext } from "../../netlifyIdentityContext";
import { Link } from 'gatsby';
import { Button } from '@material-ui/core';
import LogInButton from '../components/Login';

const index = () => {
  const { user } = useContext(IdentityContext);

  if (!user) {
    return (
      <Layout>
        <SEO title="Home" />
        <div>
          <h1>Welcome</h1>
          <p>You must be logged in to create Bookmarkd.</p>
          <p>With bookmarks app you can save your bookmark at cloud.</p>
          <ul>
            <li>You can create.</li>
            <li>You can modify.</li>
            <li>You can delete.</li>
            <li>You can visit.</li>
          </ul>
          <LogInButton />
        </div>
      </Layout>
    )
  }
  return (
    <Layout>
      <SEO title="Home" />
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <h1>Welcome {user.user_metadata.full_name}</h1>
        <Link to="/bookmark" style={{ textDecoration: 'none' }} >
          <Button color="primary" variant="contained">Create Bookmark</Button>
        </Link>
      </div>
    </Layout>
  )
}

export default index;