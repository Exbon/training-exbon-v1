import React from "react";

import "assets/jss/nextjs-material-dashboard/New/loginStyle.css";

import InputLabel from "@material-ui/core/InputLabel";
// layout for this page
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import exbonLogo from "../assets/img/exbon logo.png";

const login = () => {
  return (
    <div className={"backgroundPage"}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={3} style={{ marginTop: "100px" }}>
          <Card>
            <CardHeader color="primary">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <h4 className={"cardTitleWhite"}>Dashboard</h4>
                  <p className={"cardCategoryWhite"}>Login</p>
                </div>
                <div>
                  <img
                    src={exbonLogo}
                    style={{ width: "50px", height: "50px" }}
                  ></img>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={7}>
                  <CustomInput
                    labelText="Username"
                    id="username"
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={7}>
                  <CustomInput
                    labelText="Password"
                    id="password"
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter style={{ justifyContent: "center", marginTop: "50px" }}>
              <Button color="primary">Login</Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={3}>
          <div className={"space"}></div>
        </GridItem>
      </GridContainer>
    </div>
  );
};

export default login;
