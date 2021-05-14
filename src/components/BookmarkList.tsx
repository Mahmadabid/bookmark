import React, { useState } from "react"
import Layout from "./layout"
import SEO from "./seo"
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { Button, List, useMediaQuery } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useSelector } from "react-redux";
import { State } from "../Global/Types/SliceTypes";
import CircularProgress from '@material-ui/core/CircularProgress';
import Bookmark from "./Bookmark";
import { Formik, Field, Form } from 'formik';
import * as Yup from "yup";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
      width: '35ch',
    },
    resInput: {
      width: '27ch',
    },
    button: {
      marginLeft: '15px',
    },
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
    rootQuery: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
    list: {
      marginTop: '10px',
      marginLeft: '10px',
    },
    LightList: {
      backgroundColor: 'hsl(227deg 100% 97%)',
    },
  }),
);


// This query is executed at run time by Apollo.
export const GET_BOOKMARK = gql`
{
  bookmarks {
    name,
    id,
    url,
  }
}
`;

const ADD_BOOKMARK = gql`
  mutation addBookmark($name: String!, $url: String) {
    addBookmark(name: $name, url: $url) {
      name,
      url
    }
  }
`;

interface Info {
  id: string
  name: string
  url: string
}

const BookmarkList = () => {
  const initialValues = { url: "", name: "" };

  const classes = useStyles();
  const { loading, error, data } = useQuery(GET_BOOKMARK);
  const islit = useSelector((state: State) => state.themes.value);
  const matches = useMediaQuery('(max-width:380px)');
  const [formValues, setFormValues] = useState(initialValues);
  const [addBookmark, { loading: AddLoading }] = useMutation(ADD_BOOKMARK);
  const [DelLoading, setDelLoading] = useState(false);
  const [EditLoading, setEditLoading] = useState(false);

  const schema = Yup.object({
    url: Yup.string()
      .matches(
        /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
        'Enter correct url!'
      )
      .required('Please enter Url'),
    name: Yup.string()
      .required('Name is Required'),
  });

  const AddTask = () => {

    addBookmark({
      variables: {
        name: formValues.name,
        url: formValues.url
      },
      refetchQueries: [{ query: GET_BOOKMARK }],
    })

    setFormValues(initialValues)
  }

  if (loading) {
    return (
      <Layout>
        <SEO title="Todo" />
        <h1>Loading...</h1>
      </Layout>
    );
  }

  if (error) {

    return (
      <Layout>
        <SEO title="Todo" />
        <h3>Error, Please try again later</h3>
      </Layout>
    );
  }

  const Load = () => {
    return (
      <div className="loading">
        <CircularProgress />
      </div>
    )
  }

  if (data) {

    return (
      <Layout>
        <SEO title="Todo" />
        {AddLoading || DelLoading || EditLoading ?
          <Load />
          :
          null}
        <Formik
          initialValues={
            initialValues
          }
          validationSchema={
            schema
          }
          onSubmit={
            (values) => {
              setFormValues({ ...values });
console.log(formValues);
              AddTask()
console.log(formValues);
            }
          }
        >
          {(formik) => (
            <Form>
              <div className="main">
                <Field helperText={formik.touched.name ? formik.errors.name : ""} error={formik.touched.name && Boolean(formik.errors.name)} className={matches? classes.resInput: classes.input} name="name" type="text" as={TextField} label="name" variant="outlined" />
                <br />
                <Field helperText={formik.touched.url ? formik.errors.url : ""} error={formik.touched.url && Boolean(formik.errors.url)} className={matches? classes.resInput: classes.input} name="url" type="text" as={TextField} label="url" variant="outlined" />
                <br />
                <br />
                <Button type="submit" className={`button ${classes.button}`} variant="contained" color="primary">ADD Bookmark</Button>
              </div>
            </Form>
          )}
        </Formik>
        { data.bookmarks && data.bookmarks.map((info: Info, index: number) =>
          <List key={index} className={`${matches ? classes.rootQuery : classes.root} ${classes.list} ${islit ? classes.LightList : ''} `}>
            <Bookmark setDelLoading={setDelLoading} setEditLoading={setEditLoading} name={info.name} id={info.id} url={info.url} />
          </List>
        )
        }
      </Layout >
    );
  }
  else {
    return (
      <h1>Please Reload!</h1>
    )
  }
}

export default BookmarkList;
