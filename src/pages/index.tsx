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
          <p>You must be logged in to create Todos.</p>
          <p>Todos keep track of your daily tasks.</p>
          <ul>
            <li>You can create.</li>
            <li>You can modify.</li>
            <li>You can delete.</li>
            <li>You can check.</li>
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
        <Link to="/todo" style={{ textDecoration: 'none' }} >
          <Button color="primary" variant="contained">Create Todo</Button>
        </Link>
      </div>
    </Layout>
  )
}

export default index;