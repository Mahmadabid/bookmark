import React, { useContext } from 'react';
import { IdentityContext } from "../../netlifyIdentityContext";
import TaskBox from '../components/TaskBox';
import Layout from '../components/layout';
import SEO from '../components/seo';
import LogInButton from '../components/Login';

const LoggedOut = () => {

  return (
    <Layout>
      <SEO title="Home" />
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <h1>Create Todos</h1>
        <p>You are not logged In.</p>
        <p>LogIn to create Todos</p>
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
      <TaskBox />
    )
  }
}

export default todo;