import React from "react"
import { Link } from "gatsby"
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../Global/Slice/ThemeSlice';
import { State } from '../Global/Types/SliceTypes';
import GitHubIcon from '@material-ui/icons/GitHub';
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import './header.css';

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
  }),
);

interface HeaderProps {
  siteTitle: string
}

const Header = ({ siteTitle }: HeaderProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const islit = useSelector((state: State) => state.themes.value);

  const themeHandle = () => {
    dispatch(setTheme())
    var element = document.body;
    element.classList.toggle("body");
  };
  return (
    <div className={classes.root}>
      <AppBar className={islit ? 'day' : 'dark'} position="static" >
        <Toolbar>
          <a href="https://github.com/Mahmedabid/Contentful-Blog" target="blank">
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
          <IconButton onClick={themeHandle} color="inherit" >
            {islit ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Header
