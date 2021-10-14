import React, { useState, useEffect } from "react";
import Router, { useRouter } from "next/router";
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Poppers from "@material-ui/core/Popper";
import Person from "@material-ui/icons/Person";

import Button from "components/CustomButtons/Button.js";
import useWindowSize from "components/Hooks/useWindowSize.js";

import styles from "assets/jss/nextjs-material-dashboard/components/headerLinksStyle.js";

import { CookiesProvider, useCookies } from "react-cookie";
import { isFirstDayOfMonth } from "date-fns";

import axios from "axios";

export default function AdminNavbarLinks() {
  const [cookies, setCookie, removeCookie] = useCookies();
  const [state, setState] = useState({ FullName: "" });
  const [testData, setTestData] = useState("");

  const size = useWindowSize();
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const [openNotification, setOpenNotification] = React.useState(null);
  const [openProfile, setOpenProfile] = React.useState(null);
  const handleClickNotification = event => {
    if (openNotification && openNotification.contains(event.target)) {
      setOpenNotification(null);
    } else {
      setOpenNotification(event.currentTarget);
    }
  };
  const handleCloseNotification = () => {
    setOpenNotification(null);
  };
  const handleClickProfile = event => {
    if (openProfile && openProfile.contains(event.target)) {
      setOpenProfile(null);
    } else {
      setOpenProfile(event.currentTarget);
    }
  };
  const handleCloseProfile = () => {
    // setOpenProfile(null);
    removeCookie("username", { path: "/" });
    removeCookie("fullname", { path: "/" });
    removeCookie("employeeid", { path: "/" });
    removeCookie("password", { path: "/" });
    Router.push("/login");
  };

  useEffect(() => {
    setState({
      FullName: cookies.fullname,
    });

    axios({
      method: "get",
      url: `https://www.wrike.com/api/v4/contacts`,
      timeout: 5000, // 5 seconds timeout
      headers: {
        Authorization:
          "bearer eyJ0dCI6InAiLCJhbGciOiJIUzI1NiIsInR2IjoiMSJ9.eyJkIjoie1wiYVwiOjIxMjg5MzIsXCJpXCI6NjYyMzk5NixcImNcIjo0NTkzODAxLFwidVwiOjQyODM2NzEsXCJyXCI6XCJVU1wiLFwic1wiOltcIldcIixcIkZcIixcIklcIixcIlVcIixcIktcIixcIkNcIixcIkFcIixcIkxcIl0sXCJ6XCI6W10sXCJ0XCI6MH0iLCJpYXQiOjE1NzA0NTc4NDR9.ayTohiITZBNn5f2axYfdDwUEsXC-WSlMFocdijGI0ic",
      },
      // data: {
      //   hashstr: router.query.hash,
      // },
    }).then(response => {
      let data = response.data.data;
      for (let i = 0; i < data.length; i++) {
        if (data[i].profiles[0].email == cookies.username + "@exbon.com") {
          setTestData(data[i].id);
        }
      }
    });
  }, [cookies]);

  return (
    <div>
      <div className={classes.manager}>
        <div style={{ display: "flex" }}>
          <p
            style={{
              fontFamily: "Roboto",
              fontWeight: "600",
              color: "#c0c2c7",
              marginTop: "16px",
            }}
          >
            {state.FullName} ({testData})
          </p>
          <Button
            color={size.width > 959 ? "transparent" : "white"}
            justIcon={size.width > 959}
            simple={!(size.width > 959)}
            aria-owns={openProfile ? "profile-menu-list-grow" : null}
            aria-haspopup="true"
            onClick={handleClickProfile}
            className={classes.buttonLink}
          >
            <Person className={classes.icons} style={{ color: "#c0c2c7" }} />
          </Button>
          <Poppers
            open={Boolean(openProfile)}
            anchorEl={openProfile}
            transition
            disablePortal
            className={
              classNames({ [classes.popperClose]: !openProfile }) +
              " " +
              classes.popperNav
            }
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="profile-menu-list-grow"
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom",
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={() => null}>
                    <MenuList role="menu">
                      <MenuItem
                        onClick={handleCloseProfile}
                        className={classes.dropdownItem}
                      >
                        Logout
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Poppers>
        </div>
      </div>
    </div>
  );
}
