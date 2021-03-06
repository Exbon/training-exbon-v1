import React from "react";

import styles from "assets/jss/nextjs-material-dashboard/New/loginStyle.js";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// layout for this page
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import TextField from "@material-ui/core/TextField";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import { sha256 } from "js-sha256";
import axios from "axios";
import Router, { useRouter } from "next/router";
import { CookiesProvider, useCookies } from "react-cookie";

import exbonLogo from "../assets/img/exbon logo.png";

import Image from "next/image";

const login = () => {
  const [cookies, setCookie, removeCookie] = useCookies("username");
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const handleLoginButton = async () => {
    const username = document.getElementById("username").value;
    const password =
      "0x" + sha256(document.getElementById("password").value).toUpperCase();

    await axios({
      method: "post",
      url: `/api/dashboard/signin`,
      timeout: 1000, // 1 seconds timeout
      headers: {},
      data: {
        Username: username,
        Password: password,
      },
    }).then(response => {
      if (response.data.result.recordset[0] !== undefined) {
        const result = response.data.result.recordset[0];
        setCookie("employeeid", result.EmployeeID, {
          path: "/",
          maxAge: 3600 * 24 * 30,
        });
        setCookie("fullname", result.FullName, {
          path: "/",
          maxAge: 3600 * 24 * 30,
        });
        setCookie("username", username, {
          path: "/",
          maxAge: 3600 * 24 * 30,
        });
        setCookie("password", password, {
          path: "/",
          maxAge: 3600 * 24 * 30,
        });

        Router.push(`/home/p0/start`);
      } else {
        alert("Login failed.");
      }
    });
  };

  const handleKeyPress = event => {
    if (event.key === "Enter") {
      handleLoginButton();
    }
  };
  //change
  return (
    <>
      <div className={classes.backgroundPage}></div>
      <GridContainer justify="center">
        <GridItem
          xs={12}
          sm={12}
          md={3}
          style={{ marginTop: "100px", marginBottom: "200px" }}
        >
          <Card>
            <CardHeader color="primary">
              <div className={classes["card-header"]}>
                <div>
                  <h4 className={classes["card-header__title"]}>
                    Exbon Training
                  </h4>
                  <p className={classes["card-header__detail"]}>Login</p>
                </div>
                <div>
                  <Image src={exbonLogo} width={50} height={50}></Image>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={7}>
                  <TextField
                    label="Username"
                    id="username"
                    onKeyPress={handleKeyPress}
                    style={{ width: "100%", marginTop: "30px" }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={7}>
                  <TextField
                    label="Password"
                    id="password"
                    type="password"
                    onKeyPress={handleKeyPress}
                    style={{ width: "100%", marginTop: "30px" }}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter style={{ justifyContent: "center", marginTop: "50px" }}>
              <Button
                color="primary"
                onClick={handleLoginButton}
                style={{ fontSize: "small" }}
              >
                Login
              </Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={3}>
          <div className={"space"}></div>
        </GridItem>
      </GridContainer>
    </>
  );
};

export default login;
