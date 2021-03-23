import { useState, useEffect } from "react";
import Admin from "layouts/Admin.js";
import { makeStyles } from "@material-ui/core/styles";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import styles from "assets/jss/nextjs-material-dashboard/views/calendarStyle.js";

import ReactTooltip from "react-tooltip";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { CookiesProvider, useCookies } from "react-cookie";
import axios from "axios";
import "../../assets/jss/nextjs-material-dashboard/New/ScheduleStyle.css";
import { formatDate } from "../../components/New/formatDate";
import Loader from "react-loader-spinner";
import LoginComponent from "../../components/New/LoginComponent";
import Router, { useRouter } from "next/router";

const Calendar = () => {
  const router = useRouter();
  const useStyles = makeStyles(styles);
  const classes = useStyles();

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

  const handleEventPositioned = info => {
    info.el.setAttribute(
      "data-tip",
      "Project ID : " +
        info.event._def.extendedProps.ProjectID +
        "<br/>" +
        "Project Group : " +
        info.event._def.extendedProps.ProjectGroup +
        "<br/>" +
        "Project Name : " +
        info.event._def.extendedProps.ProjectName +
        "<br/>" +
        "Position : " +
        info.event._def.extendedProps.EmployeePosition +
        "<br/>" +
        "Start Date : " +
        formatDate(info.event._instance.range.start) +
        "<br/>" +
        "End Date : " +
        formatDate(info.event._instance.range.end) +
        "<br/>" +
        "Status : " +
        info.event._def.extendedProps.Status
    );

    ReactTooltip.rebuild();
  };

  useEffect(() => {
    let promises = [];

    const fetchData = async () => {
      if (status.cookies.username !== 0) {
        if (status.cookies.username !== undefined) {
          await axios({
            method: "get",
            url: `/api/calendar/${status.cookies.employeeid}`,
            timeout: 10000, // 10 seconds timeout
            headers: {},
          }).then(response => {
            setData(response.data);
          });
        }
      } else {
        if (router.query.pw !== undefined) {
          await axios({
            method: "post",
            url: `/api/dashboard/signin-pw`,
            timeout: 5000, // 5 seconds timeout
            headers: {},
            data: {
              Password: router.query.pw,
            },
          }).then(response => {
            const employeeInfo = response.data.result.recordsets[0][0];
            if (employeeInfo !== undefined) {
              setCookie("fullname", employeeInfo.FullName, {
                path: "/",
                maxAge: 3600 * 24 * 30,
              });
              setCookie("password", router.query.pw, {
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
                  password: router.query.pw,
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
  }, [status]);

  const { promiseInProgress } = usePromiseTracker();

  const signin = async (username, password) => {
    await axios({
      method: "post",
      url: `/api/dashboard/signin`,
      timeout: 3000, // 5 seconds timeout
      headers: {},
      data: {
        Username: username,
        Password: password,
      },
    }).then(response => {
      if (response.data.result.recordset[0] !== undefined) {
        setCookie("username", username, { path: "/", maxAge: 3600 * 24 * 30 });
        setCookie("password", password, { path: "/", maxAge: 3600 * 24 * 30 });
        setCookie("fullname", response.data.result.recordset[0].FullName, {
          path: "/",
          maxAge: 3600 * 24 * 30,
        });
        setCookie("employeeid", response.data.result.recordset[0].EmployeeID, {
          path: "/",
          maxAge: 3600 * 24 * 30,
        });
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
    });
  };

  return (
    <div
      style={
        status.cookies.username === undefined
          ? { overflowX: "hidden" }
          : { overflowX: "auto" }
      }
    >
      {status.cookies.username === undefined ||
      status.cookies.employeeid === undefined ? (
        <LoginComponent signin={signin} />
      ) : (
        <Card style={{ width: "1100px" }}>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Schedule Calendar</h4>
            <p className={classes.cardCategoryWhite}>My Project Schedule</p>
          </CardHeader>
          <div className="frame">
            {promiseInProgress || status.cookies.employeeid === 0 ? (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {console.log(promiseInProgress)}
                {console.log(status.cookies.employeeid)}
                <Loader type="Oval" color="#FAC863" height="100" width="100" />
              </div>
            ) : (
              <>
                <FullCalendar
                  plugins={[dayGridPlugin]}
                  height="100%"
                  initialView="dayGridMonth"
                  events={data}
                  dayMaxEventRows={100}
                  eventColor="white"
                  eventTextColor="white"
                  displayEventTime={false}
                  eventDidMount={handleEventPositioned}
                />
                <ReactTooltip
                  className="tooltip"
                  multiline={true}
                  type="info"
                  offset={{ top: 10 }}
                />
              </>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

Calendar.layout = Admin;

export default Calendar;
