import { useState, useEffect } from "react";
import ReactTooltip from "react-tooltip";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { CookiesProvider, useCookies } from "react-cookie";
import axios from "axios";
import "../../assets/jss/nextjs-material-dashboard/New/ScheduleStyle.css";
import { formatDate } from "./formatDate";
const Schedule = () => {
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
        formatDate(info.event._instance.range.end)
    );

    ReactTooltip.rebuild();
  };

  useEffect(() => {
    if (status.cookies.username !== 0) {
      if (status.cookies.username !== undefined) {
        console.log("test");
        console.log("EmployeeID: " + status.cookies.employeeid);
        const fetchData = async () => {
          let result = await axios({
            method: "get",
            url: `/api/calendar/${5023}`,
            timeout: 15000, // 15 seconds timeout
            headers: {},
          });
          setData(result.data);
        };
        trackPromise(fetchData());
      }
    } else {
      setStatus({
        cookies: {
          username: cookies.username,
          password: cookies.password,
          fullname: cookies.fullname,
          employeeid: cookies.employeeid,
        },
      });
    }
  }, [status, cookies]);

  const { promiseInProgress } = usePromiseTracker();

  return (
    <>
      <div className="frame">
        {promiseInProgress === 0 ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Loader type="Oval" color="#FAC863" height="100" width="100" />
          </div>
        ) : (
          <>
            {console.log(data)}
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
    </>
  );
};

export default Schedule;
