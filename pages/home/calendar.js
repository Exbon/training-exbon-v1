import { useState, useEffect } from "react";
import Admin from "layouts/Admin.js";
import { makeStyles } from "@material-ui/core/styles";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import styles from "assets/jss/nextjs-material-dashboard/views/calendarStyle.js";
import Schedule from "../../components/New/Schedule";
const Calendar = () => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  return (
    <div>
      <Card style={{ width: "1200px" }}>
        <CardHeader color="primary">
          <h4 className={classes.cardTitleWhite}>Schedule Calendar</h4>
          <p className={classes.cardCategoryWhite}>Project Schedule</p>
        </CardHeader>
        <Schedule />
      </Card>
    </div>
  );
};

Calendar.layout = Admin;

export default Calendar;
