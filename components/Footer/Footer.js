/*eslint-disable*/
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
// core components
import styles from "assets/jss/nextjs-material-dashboard/components/footerStyle.js";
import { CookiesProvider, useCookies } from "react-cookie";

export default function Footer(props) {
  const [cookies, setCookie, removeCookie] = useCookies();
  const [state, setState] = useState({ EmployeeID: 0 });
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  useEffect(() => {
    setState({
      EmployeeID: cookies.employeeid,
    });
  }, [cookies]);
  return (
    <footer className={classes.footer}>
      <div className={classes.container}>
        {/* <div className={classes.left}>
          <List className={classes.list}>
            <ListItem className={classes.inlineBlock}>
              <a href="/" className={classes.block}>
                Home
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a
                href="https://dailyreport.exbon.com/"
                className={classes.block}
              >
                Daily Report
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a
                href={
                  "https://dailyreport.exbon.com/calendar/" + state.EmployeeID
                }
                className={classes.block}
              >
                Calendar
              </a>
            </ListItem>
          </List>
        </div> */}
        <p className={classes.right}>
          <span>
            &copy; {1900 + new Date().getYear()}{" "}
            <a href="" target="_blank" className={classes.a}>
              Exbon Development, Inc.
            </a>
          </span>
        </p>
      </div>
    </footer>
  );
}
