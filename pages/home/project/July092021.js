import { useState, useEffect } from "react";
import Admin from "layouts/Admin.js";
import LoginComponent from "../../../components/New/LoginComponent";
import { CookiesProvider, useCookies } from "react-cookie";
import axios from "axios";
import { useTable, useBlockLayout, useSortBy } from "react-table";
import { formatDate } from "../../../components/New/formatDate";
import Router, { useRouter } from "next/router";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Loader from "react-loader-spinner";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import Button from "@material-ui/core/Button";
import Link from "next/link";

import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import Checkbox from "@material-ui/core/Checkbox";

import "./project.css";

const July092021 = () => {
  const router = useRouter();

  const [data, setData] = useState(() => []);
  const [cookies, setCookie, removeCookie] = useCookies();
  const [status, setStatus] = useState({
    cookies: {
      username: 0,
      password: 0,
      fullname: "",
      employeeid: 0,
    },
  });

  const signin = async (username, password) => {
    let promises = [];

    const fetchData = async () =>
      await axios({
        method: "post",
        url: `/api/dashboard/signin`,
        timeout: 5000, // 5 seconds timeout
        headers: {},
        data: {
          Username: username,
          Password: password,
        },
      })
        .then(response => {
          if (response.data.result.recordset[0] !== undefined) {
            setCookie("username", username, {
              path: "/",
              maxAge: 3600 * 24 * 30,
            });
            setCookie("password", password, {
              path: "/",
              maxAge: 3600 * 24 * 30,
            });
            setCookie("fullname", response.data.result.recordset[0].FullName, {
              path: "/",
              maxAge: 3600 * 24 * 30,
            });
            setCookie(
              "employeeid",
              response.data.result.recordset[0].EmployeeID,
              {
                path: "/",
                maxAge: 3600 * 24 * 30,
              }
            );
            setStatus(prevState => ({
              ...prevState,
              cookies: {
                username: username,
                password: password,
                fullname: response.data.result.recordset[0].FullName,
                employeeid: response.data.result.recordset[0].EmployeeID,
              },
            }));
          } else {
            alert("Login failed.");
          }
        })
        .catch(err => {
          alert(
            "Loading Error.(POST /api/dashboard/signin) \n\nPlease try again.\n\nPlease contact IT if the issue still persists. (Hyunmyung Kim 201-554-6666)\n\n" +
              err
          );
          setData(() => [
            {
              ProjectGroup: "",
              ProjectID: "",
              ProjectName: "No Permission",
              ContractAmount: "",
              Director: "",
              PIC: "",
              Associate1: "",
              Associate2: "",
              Associate3: "",
              Position: "",
              BaselineCost: "",
              EEAC: "",
              CV: "",
              CPI: "",
              ESPI: "",
              WorkCompletion: "",
              StartDate: "",
              FinishDate: "",
              Deadline: "",
              IsDesign: "",
              DesignParentID: "",
            },
          ]);
        });
    promises.push(fetchData());
    trackPromise(Promise.all(promises).then(() => {}));
  };

  useEffect(() => {
    let promises = [];

    const fetchData = async () => {
      if (status.cookies.username !== 0) {
        if (status.cookies.username !== undefined) {
          await axios({
            method: "post",
            url: `/api/dashboard/signin`,
            timeout: 5000, // 5 seconds timeout
            headers: {},
            data: {
              Username: status.cookies.username,
              Password: status.cookies.password,
            },
          }).then(response => {});
        }
      } else {
        if (router.query.hash !== undefined) {
          await axios({
            method: "post",
            url: `/api/dashboard/signin-pw`,
            timeout: 5000, // 5 seconds timeout
            headers: {},
            data: {
              hashstr: router.query.hash,
            },
          }).then(response => {
            const employeeInfo = response.data.result.recordsets[0][0];
            if (employeeInfo !== undefined) {
              setCookie("fullname", employeeInfo.FullName, {
                path: "/",
                maxAge: 3600 * 24 * 30,
              });
              setCookie("password", employeeInfo.Password, {
                path: "/",
                maxAge: 3600 * 24 * 30,
              });
              setCookie("username", employeeInfo.UserName, {
                path: "/",
                maxAge: 3600 * 24 * 30,
              });
              setCookie("employeeid", employeeInfo.EmployeeID, {
                path: "/",
                maxAge: 3600 * 24 * 30,
              });
              setStatus(prevState => ({
                ...prevState,
                cookies: {
                  username: employeeInfo.UserName,
                  password: employeeInfo.Password,
                  fullname: employeeInfo.FullName,
                  employeeid: employeeInfo.EmployeeID,
                },
              }));
            } else {
              alert("The user cannot be found.");
            }
          });
        } else {
          setStatus(prevState => ({
            ...prevState,
            cookies: {
              username: cookies.username,
              password: cookies.password,
              fullname: cookies.fullname,
              employeeid: cookies.employeeid,
            },
          }));
        }
      }
    };
    promises.push(fetchData());
    trackPromise(Promise.all(promises).then(() => {}));
  }, [status, router.query]);

  const { promiseInProgress } = usePromiseTracker();

  const [acc, setAcc] = useState({
    first: false,
    second: false,
  });

  const [state, setState] = useState({
    gilad: false,
    jason: false,
    antoine: false,
  });

  const handleChange = event => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  const { gilad, jason, antoine } = state;
  const error = [gilad, jason, antoine].filter(v => v).length !== 2;

  const changeAcc = order => {
    if (order == "first") {
      setAcc({ ...acc, first: !acc.first });
    } else if (order == "second") {
      setAcc({ ...acc, second: !acc.second });
    }
  };

  return (
    <>
      {promiseInProgress ? (
        <div
          style={{
            width: "100%",
            height: "100px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Loader
            type="BallTriangle"
            color="#31c4b0"
            height="150"
            width="150"
          />
        </div>
      ) : status.cookies.username === undefined ||
        status.cookies.employeeid === undefined ? (
        <LoginComponent signin={signin} />
      ) : data.length === 1 ? (
        <div
          style={{
            width: "100%",
            height: "100px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Loader
            type="BallTriangle"
            color="#31c4b0"
            height="150"
            width="150"
          />
        </div>
      ) : (
        <div className="background">
          <div style={{ width: "100%" }}>
            <Grid container>
              <Grid item xs={6}>
                <div style={{ display: "flex" }}>
                  <p className="title-day">Day 3</p>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker
                      disableToolbar
                      variant="inline"
                      format="MM/dd/yyyy"
                      value={"07/09/2021"}
                      onChange={() => {}}
                      className="datepicker"
                      autoOk={true}
                    />
                  </MuiPickersUtilsProvider>
                </div>

                <br />
                <br />
                <br />
                {/* <div style={{ marginLeft: "30px" }}>
                  <Accordion
                    expanded={acc.first}
                    className="acc"
                    onChange={() => changeAcc("first")}
                  >
                    <AccordionSummary id="acc1">
                      <Typography style={{ fontWeight: "500" }}>
                        Field Worker
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails
                      style={{ color: "#6e6b6b", fontWeight: "500" }}
                    >
                      3 field workers worked on Task 1 for 8 hours.
                    </AccordionDetails>
                  </Accordion>
                  <Accordion
                    expanded={acc.second}
                    onChange={() => changeAcc("second")}
                  >
                    <AccordionSummary id="acc2">
                      <Typography style={{ fontWeight: "500" }}>
                        Subcontractor
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails
                      style={{ color: "#6e6b6b", fontWeight: "500" }}
                    >
                      ABC subcontractor finished 20% of Task 2.
                    </AccordionDetails>
                  </Accordion>
                </div> */}
              </Grid>
              <Grid item xs={6}>
                <div
                  style={{
                    minHeight: "90vh",
                    borderRadius: "10px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    borderLeft: "2px dotted #7e7a7a",
                    borderTopLeftRadius: "0px",
                    borderBottomLeftRadius: "0px",
                  }}
                >
                  <div style={{ padding: "1%" }}>
                    <h2
                      style={{
                        color: "#fcfaf8",
                        fontWeight: "400",
                        textAlign: "center",
                      }}
                    >
                      Objective: Change Order
                    </h2>
                    <p
                      style={{
                        marginTop: "40px",
                        marginBottom: "20px",
                        color: "#f7f3f0",
                        fontWeight: "500",
                        marginLeft: "5px",
                      }}
                    >
                      The customer asked for some work to be done that was not
                      part of the initial specification.
                    </p>
                    <div
                      style={{
                        borderTop: "3px dotted #7e7a7a",
                        borderBottom: "3px dotted #7e7a7a",
                        borderRadius: "2px",
                        padding: "1%",
                        paddingBottom: "3%",
                      }}
                    >
                      <div className="textfield">
                        <p
                          style={{
                            color: "white",
                            fontWeight: "500",
                            marginBottom: "1px",
                          }}
                        >
                          Q1. What should be done in this case? (Multiple
                          choice)
                        </p>
                        <div
                          style={{
                            marginLeft: "20px",
                            marginTop: "1px",
                          }}
                        >
                          <FormControl
                            sx={{
                              m: 3,
                              marginBottom: "5px",
                            }}
                            component="fieldset"
                            variant="standard"
                          >
                            <FormLabel component="legend"></FormLabel>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={gilad}
                                    onChange={handleChange}
                                    name="gilad"
                                    className="checkBox"
                                  />
                                }
                                label="omnis iste natus error sit voluptatem accusantium doloremque laudantium."
                                className="formLabel"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={jason}
                                    onChange={handleChange}
                                    name="jason"
                                    className="checkBox"
                                  />
                                }
                                label="sit amet, consectetur, adipisci velit, sed quia non numquam eius"
                                className="formLabel"
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={antoine}
                                    onChange={handleChange}
                                    name="antoine"
                                    className="checkBox"
                                  />
                                }
                                label="Duis aute irure dolor in reprehenderit in voluptate velit esse"
                                className="formLabel"
                              />
                            </FormGroup>
                            {/* <FormHelperText>Be careful</FormHelperText> */}
                          </FormControl>
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        marginTop: "0px",
                        borderBottom: "3px dotted #7e7a7a",
                        borderRadius: "2px",
                        padding: "1%",
                        paddingBottom: "3%",
                      }}
                    >
                      <p
                        style={{
                          color: "white",
                          fontWeight: "500",
                          marginBottom: "10px",
                        }}
                      >
                        Q2. Create a Change Order with the following estimates,
                        then upload it.
                      </p>
                      <Button
                        variant="contained"
                        className="uploadBtn"
                        component="label"
                        style={{ marginLeft: "5%" }}
                      >
                        Upload File
                        <input type="file" hidden />
                      </Button>
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "1%",
                      textAlign: "right",
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "20px",
                      marginRight: "20px",
                      marginLeft: "20px",
                    }}
                  >
                    <Link href="./July082021">
                      <Button variant="contained" className="prevBtn">
                        Previous
                      </Button>
                    </Link>
                    <Link href="./July112021">
                      <Button variant="contained" className="nextBtn">
                        Next
                      </Button>
                    </Link>
                    {/* <Link href="#">
                      <Button variant="contained" className="submitBtn">
                        Submit
                      </Button>
                    </Link> */}
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
      )}
    </>
  );
};

July092021.layout = Admin;

export default July092021;
