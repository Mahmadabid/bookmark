import React, { Dispatch, SetStateAction } from 'react';
import { IconButton, ListItem, ListItemText } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import EditIcon from '@material-ui/icons/Edit';
// import { GET_TODO } from './TaskBox';
// import Button from '@material-ui/core/Button';
// import TextField from '@material-ui/core/TextField';
// import Dialog from '@material-ui/core/Dialog';
// import DialogActions from '@material-ui/core/DialogActions';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
// import DialogTitle from '@material-ui/core/DialogTitle';
// import { StringLiteralLike } from 'typescript';
import LinkIcon from '@material-ui/icons/Link';
import { GET_BOOKMARK } from './BookmarkList';

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
    mutation editBookmark($id: ID!, $name: String!, $url: String!) {
        editBookmark(id: $id, name: $name, url: $url) {
            id,
            name,
            url
        }
    }
`;

const Bookmark: React.FC<BookmarkProps> = ({ setDelLoading, setEditLoading, name, id, url }) => {

    // const [open, setOpen] = useState(false);
    // const [NameError, setNameError] = useState(false);
    // const [UrlError, setUrlError] = useState(false);

    // const handleClickOpen = () => {
    //     setOpen(true);
    // };

    // const handleClose = () => {
    //     setOpen(false);
    // };

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
            awaitRefetchQueries: true,
        });
    }

    const EditBookmark = () => {
        const Name = prompt("Enter name");
        if (Name === "") {
            alert("Enter name");
        }
        const Url = prompt("Enter url");
        if (Url === "") {
            alert("Enter url");
        }
        else {
            editBookmark({
                variables: {
                    id,
                    url: Url,
                    name: Name
                },
                refetchQueries: [{ query: GET_BOOKMARK }],
                awaitRefetchQueries: true,
            });
        }
    }

    // const EditButton = () => {
    //     return (
    //         <div>
    //             <EditIcon style={{ marginRight: '20px', cursor: 'pointer' }} onClick={handleClickOpen} />
    //             <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
    //                 <DialogTitle id="form-dialog-title">Edit</DialogTitle>
    //                 <DialogContent>
    //                     <DialogContentText>
    //                         To change the name and url enter the values and edit
    //                 </DialogContentText>
    //                     <TextField
    //                         autoFocus
    //                         margin="dense"
    //                         id="name"
    //                         label="name"
    //                         type="text"
    //                         fullWidth
    //                         onChange={(e) => setName(e.target.value)}
    //                         error={NameError} helperText={NameError ? 'Empty field!' : ' '}
    //                     />
    //                     <TextField
    //                         autoFocus
    //                         margin="dense"
    //                         id="url"
    //                         label="url"
    //                         type="url"
    //                         fullWidth
    //                         onChange={(e) => setUrl(e.target.value)}
    //                         error={UrlError} helperText={UrlError ? 'Empty field!' : ' '}
    //                     />
    //                 </DialogContent>
    //                 <DialogActions>
    //                     <Button onClick={handleClose} color="primary">
    //                         Cancel
    //                     </Button>
    //                     <Button onClick={EditBookmark} color="primary">
    //                         Edit
    //                     </Button>
    //                 </DialogActions>
    //             </Dialog>
    //         </div>
    //     )
    // }

    return (
        <ListItem>
            <a href={url} target="blank">
                <IconButton color="inherit">
                    <LinkIcon />
                </IconButton>
            </a>
            <ListItemText primary={name} secondary={url} />
            {/* <EditButton /> */}
                <EditIcon style={{ marginRight: '20px', cursor: 'pointer' }} onClick={EditBookmark} />
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