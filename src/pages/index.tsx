import * as React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <h1>Hi people</h1>
    <p>Welcome to Gatsby starter.</p>
    <p> It includes:</p>
    <ul>
      <li>Typescript</li>
      <li>Material-ui</li>
      <li>Redux toolkit</li>
      <li>Dark Theme</li>
      <li>dotenv</li>
    </ul>
    <p>In order to change the title, description and other details go to gatsby-config file and edit the title</p>
  </Layout>
)

export default IndexPage
