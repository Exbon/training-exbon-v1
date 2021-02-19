import React from "react";
import styles from "assets/jss/nextjs-material-dashboard/New/loginStyle.js";
import { makeStyles } from "@material-ui/core/styles";

const login = () => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  return (
    <div>
      <h1 className={classes.title}>test</h1>
    </div>
  );
};

export default login;
