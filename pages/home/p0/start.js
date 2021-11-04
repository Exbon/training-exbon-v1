import { useState, useEffect } from "react";
import Admin from "layouts/Admin.js";
import LoginComponent from "../../../components/New/LoginComponent";
import { CookiesProvider, useCookies } from "react-cookie";
import axios from "axios";

import Router, { useRouter } from "next/router";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Loader from "react-loader-spinner";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import Button from "@material-ui/core/Button";
import Link from "next/link";

import { makeStyles } from "@material-ui/core/styles";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

import Profile1 from "../../../assets/img/faces/profile1.png";
import Profile2 from "../../../assets/img/faces/profile2.png";
import Profile3 from "../../../assets/img/faces/profile3.png";
import Profile4 from "../../../assets/img/faces/profile4.png";
import Profile5 from "../../../assets/img/faces/profile5.png";
import Profile6 from "../../../assets/img/faces/profile6.png";
import Profile7 from "../../../assets/img/faces/profile7.png";
import Subcontractor1 from "../../../assets/img/faces/sub1.png";
import Subcontractor2 from "../../../assets/img/faces/sub2.png";
import Vendor1 from "../../../assets/img/faces/vendor1.png";
import Vendor3 from "../../../assets/img/faces/vendor3.png";

import CloudDownloadIcon from "@material-ui/icons/CloudDownload";

import "./project.css";

const start = () => {
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
        });
    promises.push(fetchData());
    trackPromise(Promise.all(promises).then(() => {}));
  };

  useEffect(() => {
    let promises = [];

    const fetchData = async () => {
      if (status.cookies.username !== 0) {
        if (status.cookies.username !== undefined) {
          if (status.cookies.username == 1) {
            return null;
          }
          await axios({
            method: "post",
            url: `/api/dashboard/signin`,
            timeout: 5000, // 5 seconds timeout
            headers: {},
            data: {
              Username: status.cookies.username,
              Password: status.cookies.password,
            },
          }).then(response => {
            if (response.data.result.recordset.length == 0) {
              removeCookie("fullname");
              removeCookie("password");
              removeCookie("username");
              removeCookie("employeeid");
              setStatus(prevState => ({
                ...prevState,
                cookies: {
                  username: 1,
                  password: 1,
                  fullname: 1,
                  employeeid: 1,
                },
              }));
              alert("Login Failed.");
            }
          });
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

  const handleEmail = async () => {
    let promises = [];

    const fetchData = async () => {
      await axios({
        method: "get",
        url: `/api/training/training-progress?employeeID=${cookies.employeeid}&day=6&part=1`,
        timeout: 5000, // 5 seconds timeout
        headers: {},
      }).then(async response => {
        const result = response.data.result.recordsets[0];
        if (result.length == 0) {
          await axios({
            method: "post",
            url: `/api/training/email-sender-continue`,
            timeout: 5000, // 5 seconds timeout
            headers: {},
            data: {
              username: cookies.username,
            },
          }).then(async response => {
            await axios({
              method: "post",
              url: `/api/training/training-progress`,
              timeout: 5000, // 5 seconds timeout
              headers: {},
              data: {
                employeeID: cookies.employeeid,
                day: 6,
                part: 1,
              },
            }).then(response => {
              router.push(`./Day7`);
            });
          });
        } else {
          router.push(`./Day7`);
        }
      });
    };
    promises.push(fetchData());
    trackPromise(Promise.all(promises).then(() => {}));
  };

  return (
    <>
      {promiseInProgress || status.cookies.username == 1 ? (
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
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            minHeight: "30vh",
            width: "50%",
            marginTop: "8%",
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: "10px",
            display: "flex",
            borderLeft: "2px #7e7a7a",
            // backgroundColor: "#5e5a5a",
          }}
        >
          {/* <p
            style={{
              color: "#f7f3f0",
              fontWeight: "500",
              fontSize: "1.1rem",
              textAlign: "center",
              alignSelf: "center",
              marginLeft: "10%",
              marginRight: "10%",
            }}
          >
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum
          </p> */}
          {/* <p
            style={{
              color: "#f7f3f0",
              fontWeight: "500",
              fontSize: "1.1rem",
              textAlign: "center",
              alignSelf: "center",
            }}
          >
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum
          </p> */}
          <Button
            variant="contained"
            color="primary"
            style={{
              alignSelf: "center",
              width: "40%",
              marginBottom: "50px",
              marginTop: "30px",
            }}
            onClick={() => handleEmail()}
          >
            Continue
          </Button>
        </div>
      )}
    </>
  );
};

start.layout = Admin;

export default start;
