import React, { useContext } from 'react';
import { IdentityContext } from "../../netlifyIdentityContext";
import { Button } from '@material-ui/core';

const LogInButton = () => {
    const { identity: netlifyIdentity } = useContext(IdentityContext);

    return(
        <Button color="primary" variant="contained" onClick={() => { netlifyIdentity.open() }}>LogIn</Button>
    )
}

export default LogInButton;