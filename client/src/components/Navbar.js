import React from "react";
import { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import { NavLink, Link } from "react-router-dom";
import { withRouter } from "react-router";
import { makeStyles } from "@material-ui/core/styles";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { Grid } from "@material-ui/core";
import withWidth from "@material-ui/core/withWidth";



const useClasses = makeStyles((theme) => ({
  list: {
    width: 250,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
    padding: "20px 50px 50px 50px",
    [theme.breakpoints.down(theme.breakpoints.values.sm)]: {
      width: "auto!important",
    },
  },
  unselected: {
    color: "#333",
    textDecoration: "none",
    fontSize: "18px",
    textTransform: "initial",
    display: "flex",
    alignItems : "center",
    // [theme.breakpoints.down(theme.breakpoints.values.md)]: {
    //   fontSize: "18px",
    // },
    // [theme.breakpoints.down(theme.breakpoints.values.sm)]: {
    //     fontSize: "1px",
    // },
  },
  gamburgerMenu: {
    justifyContent: "flex-end",
  },
  closeBtn: {
    padding: "0!important",
    minWidth: "auto",
  },
  menuItem: {
    padding: "0!important",
    marginBottom: "15px",
  },
  paperAnchorRight: {
    [theme.breakpoints.down(theme.breakpoints.values.sm)]: {
      width: "100%",
    },
  },
  gamburgerMenuBtn : {
    padding : "0",
    minWidth : "auto"
  }
}));



const Navbar = () => {
  const classes = useClasses();
  const history = useHistory()
  const auth = useContext(AuthContext)
  const logoutHandler = (e) => {
      e.preventDefault()
      auth.logout()
      history.push('/')
  }


  const [state, setState] = React.useState({
    right: false,
  }); 

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
    // console.log(state);
  };

  const list = (anchor) => (
    <Grid
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItem button className={classes.menuItem}>
          <NavLink
            to="/chat"
            className={`${classes.unselected}`}
            // onClick={() => {}}
          >
            Чат
          </NavLink>
        </ListItem>
        <ListItem button className={classes.menuItem}>
          <NavLink
            to="/create"
            className={`${classes.unselected}`}
            // onClick={() => {}}
          >
            Создать
          </NavLink>
        </ListItem>
        <ListItem button className={classes.menuItem}>
          <NavLink to="/links" className={`${classes.unselected}`}>
            Ссылки
          </NavLink>
        </ListItem>
        <ListItem button className={classes.menuItem}>
            <a href="/" onClick={logoutHandler}>Выйти</a>
        </ListItem>
      </List>
    </Grid>
  );

  return (
    <Grid container className={classes.gamburgerMenu}>
        <nav>
            <div className="nav-wrapper blue darken-1" style={{padding : "0 2rem"}}>
            <a href="#!" className="brand-logo">Logo</a>
            <a href="#" data-target="mobile-demo" className="sidenav-trigger" >
                <Button className={classes.gamburgerMenuBtn} onClick={toggleDrawer("right", true)}>
                    <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="22" height="3.69231" rx="1.84615" fill="#333333"/>
                        <rect y="6.15381" width="22" height="3.69231" rx="1.84615" fill="#333333"/>
                        <rect y="12.3076" width="22" height="3.69231" rx="1.84615" fill="#333333"/>
                    </svg>
                </Button>
            </a>
            <ul className="right hide-on-med-and-down">
                <li><NavLink to="/chat">Чат</NavLink></li>
                <li><NavLink to="/create">Создать</NavLink></li>
                <li><NavLink to="/links">Ссылки</NavLink></li>
                <li><a href="/" onClick={logoutHandler}>Выйти</a></li>
            </ul>
            </div>
        </nav>
        <SwipeableDrawer
            classes={{
                paperAnchorRight: classes.paperAnchorRight, // class name, e.g. `classes-nesting-root-x`
            }}
            anchor={"right"}
            disableSwipeToOpen={true}
            open={state.right}
            onClose={toggleDrawer("right", false)}
            onOpen={toggleDrawer("right", true)}
        >
            {list("right")}
        </SwipeableDrawer>
    </Grid>
  );
}

export default Navbar

