import { useState, useEffect } from "react";
import ReactTooltip from "react-tooltip";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
const Schedule = () => {
  const [data, setData] = useState(() => []);

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
  let id = 5023;
  useEffect(() => {
    const fetchData = async () => {
      let result = await axios({
        method: "get",
        url: `/api/calendar/${id}`,
        timeout: 1000, // 1 seconds timeout
        headers: {},
      });
      setData(result.data);
    };
    trackPromise(fetchData());
  }, [id]);

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
