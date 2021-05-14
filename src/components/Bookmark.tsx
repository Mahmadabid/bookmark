import React, { Dispatch, SetStateAction, useState } from 'react';
import { IconButton, ListItem, ListItemText } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinkIcon from '@material-ui/icons/Link';
import { GET_BOOKMARK } from './BookmarkList';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from "yup";

interface BookmarkProps {
    name: string
    id: string
    url: string
    setEditLoading: Dispatch<SetStateAction<boolean>>
    setDelLoading: Dispatch<SetStateAction<boolean>>
}

const DEL_BOOKMARK = gql`
  mutation delBookmark($id: ID!) {
    delBookmark(id: $id) {
      id
    }
  }
`;

const EDIT_BOOKMARK = gql`
    mutation editBookmark($name: String!, $url: String!, $id: ID!) {
        editBookmark(name: $name, url: $url, id: $id) {
            id
            name
            url
        }
    }
`;

const Bookmark: React.FC<BookmarkProps> = ({ setDelLoading, setEditLoading, name, id, url }) => {

    const initialValues = { url, name };
    const schema = Yup.object({
        url: Yup.string()
            .matches(
                /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/,
                'Enter correct url!'
            )
            .required('Please enter Url'),

        name: Yup.string()
            .required('Name is Required'),
    });

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [delBookmark, { loading: delloading }] = useMutation(DEL_BOOKMARK);
    const [editBookmark, { loading: editloading }] = useMutation(EDIT_BOOKMARK);

    React.useEffect(() => {
        setDelLoading(delloading);
        setEditLoading(editloading);
    }, [delloading, editloading])

    const DelBookmark = () => {
        delBookmark({
            variables: {
                id,
            },
            refetchQueries: [{ query: GET_BOOKMARK }],
        });
    }

    const EditBookmark = (Url: string, Name: string) => {
        editBookmark({
            variables: {
                id,
                url: Url,
                name: Name,
            },
            refetchQueries: [{ query: GET_BOOKMARK }],
            awaitRefetchQueries: true,
        });
    }

    const EditButton = () => {
        return (
            <div>
                <EditIcon style={{ marginRight: '20px', cursor: 'pointer' }} onClick={handleClickOpen} />
                <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle style={{ color: 'blueviolet' }}><span style={{ fontWeight: "bolder" }}>Edit</span></DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To change the name and url enter the values and edit
                        </DialogContentText>
                        <Formik
                            initialValues={
                                initialValues
                            }
                            validationSchema={
                                schema
                            }
                            onSubmit={
                                (values) => {
                                    EditBookmark(values.url, values.name);
                                    handleClose();
                                }
                            }
                        >
                            {(formik) => (
                                <Form>
                                    <Field error={formik.touched.name && Boolean(formik.errors.name)} fullWidth name="name" type="text" as={TextField} label="name" variant="outlined" />
                                    <ErrorMessage className="error" component="div" name="name" />
                                    <Field style={{ marginTop: '10px' }} className="input" error={formik.touched.url && Boolean(formik.errors.url)} fullWidth name="url" type="text" as={TextField} label="url" variant="outlined" />
                                    <ErrorMessage className="error" component="div" name="url" />
                                    <DialogActions>
                                        <Button type="button" onClick={handleClose} color="primary">
                                            Cancel
                                        </Button>
                                        <Button type="submit" color="primary">
                                            Edit
                                        </Button>
                                    </DialogActions>
                                </Form>
                            )}
                        </Formik>
                    </DialogContent>
                </Dialog>
            </div>
        )
    }

    return (
        <ListItem>
            <a href={url} target="blank">
                <IconButton color="inherit">
                    <LinkIcon />
                </IconButton>
            </a>
            <ListItemText primary={name} secondary={url} />
            <EditButton />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={true}
                        onChange={DelBookmark}
                        name="checked"
                        indeterminate
                    />
                }
                label=""
            />

        </ListItem>
    )
}

export default Bookmark;