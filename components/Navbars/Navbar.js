import { useState, useEffect } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Hidden from "@material-ui/core/Hidden";
// @material-ui/icons
import Menu from "@material-ui/icons/Menu";
// core components
import AdminNavbarLinks from "./AdminNavbarLinks.js";
import RTLNavbarLinks from "./RTLNavbarLinks.js";
import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/nextjs-material-dashboard/components/headerStyle.js";
import Link from "next/link";

import ListIcon from "@material-ui/icons/List";

export default function Header(props) {
  // used for checking current route
  const router = useRouter();
  // create styles for this component
  const useStyles = makeStyles(styles);
  const [pidState, setPidState] = useState(undefined);
  const classes = useStyles();
  const makeBrand = () => {
    let name = "NextJS Material Dashboard";
    props.routes.map(prop => {
      if (router.route.indexOf(prop.layout + prop.path) !== -1) {
        name = props.rtlActive ? prop.rtlName : prop.name;
      }
      return null;
    });
    return name;
  };
  const { color } = props;
  const appBarClasses = classNames({
    [" " + classes[color]]: color,
  });

  const hideSidebar = () => {
    props.handleState();
  };
  useEffect(() => {
    setPidState(router.query.pid);
  }, [router.query.pid]);
  return (
    <AppBar className={classes.appBar + appBarClasses}>
      <Toolbar className={classes.container}>
        <div className={classes.flex}>
          {/* Here we create navbar brand, based on route name */}
          {/* <a style={{ color: "grey" }}>
            <Button
              color={
                router.query.status !== "completed" ? "info" : "transparent"
              }
              className={classes.title}
              round
              onClick={() => hideSidebar()}
            >
              Table of Contents
            </Button>
          </a> */}

          {/* Sidebar open Hyunmyung */}
          {/* <ListIcon
            className="table-contents-icon"
            onClick={() => hideSidebar()}
            color="action"
            fontSize="large"
          /> */}
          {router.route.includes("/home/dashboard") ? (
            <div>
              <Link href={`/home/dashboard`}>
                <a style={{ color: "grey" }}>
                  <Button
                    color={
                      router.query.status !== "completed"
                        ? "info"
                        : "transparent"
                    }
                    className={classes.title}
                    round
                  >
                    In Progress
                  </Button>
                </a>
              </Link>
              <Link href={`/home/dashboard?status=completed`}>
                <a style={{ color: "grey" }}>
                  <Button
                    color={
                      router.query.status === "completed"
                        ? "success"
                        : "transparent"
                    }
                    className={classes.title}
                    round
                  >
                    Completed
                  </Button>
                </a>
              </Link>
            </div>
          ) : router.route.includes("/home/dailyreport") ? (
            <div>
              {/* <Link href={`/home/dailyreport/timesheet?pid=${pidState}`}>
                <a>
                  <Button
                    color={
                      router.route.split("/")[3] === "timesheet"
                        ? "success"
                        : "transparent"
                    }
                    className={classes.title}
                    round
                  >
                    Timesheet
                  </Button>
                </a>
              </Link> */}
              {/* <Link href={`/home/dailyreport/task-completion?pid=${pidState}`}>
                <a>
                  <Button
                    color={
                      router.route.split("/")[3] === "task-completion"
                        ? "success"
                        : "transparent"
                    }
                    className={classes.title}
                    round
                  >
                    Task Completion
                  </Button>
                </a>
              </Link> */}
              {/* <Link href={`/home/dailyreport/deficiency-log?pid=${pidState}`}>
                <a>
                  <Button
                    color={
                      router.route.split("/")[3] === "deficiency-log"
                        ? "success"
                        : "transparent"
                    }
                    className={classes.title}
                    round
                  >
                    Deficiency Log
                  </Button>
                </a>
              </Link> */}
              <Button color="transparent" href="#" className={classes.title}>
                Task Completion
              </Button>
            </div>
          ) : (
            <Button color="transparent" href="#" className={classes.title}>
              {/* {makeBrand()} */}
            </Button>
          )}
        </div>
        <Hidden smDown implementation="css">
          {props.rtlActive ? <RTLNavbarLinks /> : <AdminNavbarLinks />}
        </Hidden>
        <Hidden mdUp implementation="css">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={props.handleDrawerToggle}
          >
            <Menu />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"]),
  rtlActive: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
  routes: PropTypes.arrayOf(PropTypes.object),
};
