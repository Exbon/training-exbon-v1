import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Admin from "layouts/Admin.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import styles from "assets/jss/nextjs-material-dashboard/views/dashboardStyle.js";
import MSProject from "../../components/New/MSProject";

function Dashboard() {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  return (
    <div>
      <Card style={{ width: "1080px" }}>
        <CardHeader color="info">
          <h4 className={classes.cardTitleWhite}>MS Project Data</h4>
          <p className={classes.cardCategoryWhite}>Work Completeion</p>
        </CardHeader>
        <MSProject />
      </Card>
    </div>
  );
}

Dashboard.layout = Admin;

export default Dashboard;
