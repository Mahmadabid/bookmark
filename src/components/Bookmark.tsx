import React, { Dispatch, SetStateAction } from 'react';
import { IconButton, ListItem, ListItemText } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import EditIcon from '@material-ui/icons/Edit';
import { GET_TODO } from './TaskBox';

interface BookmarkProps {
    task: string
    id: string
    status: boolean
    date: string,
    setCheckLoading: Dispatch<SetStateAction<boolean>>
    setUpdateLoading: Dispatch<SetStateAction<boolean>>
    setDelLoading: Dispatch<SetStateAction<boolean>>
}

const DEL_TODO = gql`
  mutation delTodo($id: ID!) {
    delTodo(id: $id) {
      id
    }
  }
`;

const CHECK_TODO = gql`
    mutation checkTodo($id: ID!, $status: Boolean!) {
        checkTodo(id: $id, status: $status) {
            id,
            status
        }
    }
`;

const UPDATE_TODO = gql`
    mutation UpdateTodo($id: ID!, $task: String!) {
        updateTodo(id: $id, task: $task) {
            id,
            task
        }
    }
`;

const Bookmark: React.FC<BookmarkProps> = ({ setCheckLoading, setDelLoading, setUpdateLoading, task, id, status, date }) => {

    const [delTodo, { loading: delloading }] = useMutation(DEL_TODO);
    const [checkTodo, { loading: checkloading }] = useMutation(CHECK_TODO);
    const [updateTodo, { loading: updateloading }] = useMutation(UPDATE_TODO);

    React.useEffect(() => {
        setCheckLoading(checkloading);
        setDelLoading(delloading);
        setUpdateLoading(updateloading);
    }, [checkloading, delloading, updateloading])

    const DelTask = () => {
        delTodo({
            variables: {
                id,
            },
            refetchQueries: [{ query: GET_TODO }],
        });
    }

    const CheckTask = () => {
        status = !status
        checkTodo({
            variables: {
                id,
                status
            },
            refetchQueries: [{ query: GET_TODO }],
        });
    }

    const UpdateTask = () => {
        const value = prompt("Enter new name");
        if (value === "") {
            alert("Enter a value");
        }
        else {
            updateTodo({
                variables: {
                    id,
                    task: value
                },
                refetchQueries: [{ query: GET_TODO }],
            });
        }
    }

    return (
        <ListItem>
            <IconButton onClick={CheckTask} color="inherit">
                {status ? <Favorite color="primary" /> : <FavoriteBorder />}
            </IconButton>
            <ListItemText primary={task} secondary={date} />
            <EditIcon style={{ marginRight: '20px', cursor: 'pointer' }} onClick={UpdateTask} />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={true}
                        onChange={DelTask}
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