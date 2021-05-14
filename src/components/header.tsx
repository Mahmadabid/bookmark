import React, { useContext, useState } from "react"
import { Link } from "gatsby"
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../Global/Slice/ThemeSlice';
import { State } from '../Global/Types/SliceTypes';
import GitHubIcon from '@material-ui/icons/GitHub';
import { AppBar, Toolbar, Typography, useMediaQuery } from "@material-ui/core";
import './header.css';
import Button from '@material-ui/core/Button';
import Menu, { MenuProps } from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import { IdentityContext } from "../../netlifyIdentityContext";

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props: MenuProps) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      width: '100vw',
      marginBottom: '1.45rem',
    },
    title: {
      flexGrow: 1,
      textAlign: 'center',
      fontSize: 'xx-large',
      fontWeight: 'bold'
    },
    Button: {
      color: 'white',
      fontWeight: 'bold',
    },
  }),
);

interface HeaderProps {
  siteTitle: string
}

const Header = ({ siteTitle }: HeaderProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const islit = useSelector((state: State) => state.themes.value);
  const MenuMatch = useMediaQuery('(max-width:500px)');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, identity: netlifyIdentity } = useContext(IdentityContext);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const themeHandle = () => {
    dispatch(setTheme())
    var element = document.body;
    element.classList.toggle("body");
  };
  return (
    <div className={classes.root}>
      <AppBar className={islit ? 'day' : 'dark'} position="static" >
        <Toolbar>
          <a href="https://github.com/Mahmedabid/bookmark" target="blank">
            <GitHubIcon style={{ fontSize: '40px', color: 'white' }} />
          </a>
          <Typography variant="h1" className={classes.title}>
            <Link
              to="/"
              style={{
                color: `white`,
                textDecoration: `none`,
              }}
            >
              {siteTitle}
            </Link>
          </Typography>
          {MenuMatch ?
            <>
              <IconButton aria-controls="customized-menu" aria-haspopup="true" onClick={handleClick} aria-label="upload picture" component="span">
                <MenuIcon className={classes.Button} />
              </IconButton>
              <StyledMenu
                id="customized-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <StyledMenuItem>
                  <Link to="/bookmark" style={{textDecoration: "none"}}>
                    <ListItemText primary="DashBoard" />
                  </Link>
                </StyledMenuItem>
                <StyledMenuItem>
                  <ListItemText onClick={() => { netlifyIdentity.open() }} primary={user ? user.user_metadata && user.user_metadata.full_name : "LogIn"} />
                </StyledMenuItem>
              </StyledMenu>
            </>
            :
            <>
              <Link to="/bookmark" style={{textDecoration: "none"}}>
                <Button className={classes.Button}>DashBoard</Button>
              </Link>
              <Button className={classes.Button} onClick={() => { netlifyIdentity.open() }}>{user ? user.user_metadata && user.user_metadata.full_name : "LogIn"}</Button>
            </>
          }
          <IconButton onClick={themeHandle} color="inherit" >
            {islit ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
    </div >
  );
}

export default Header
