import { useState, useMemo, useEffect } from "react";
import axios from "axios";

import { useTable } from "react-table";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import AddIcon from "@material-ui/icons/Add";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import InputMask from "react-input-mask";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { formatDate } from "../../../components/New/formatDate";
import inputTime from "../../../components/New/inputTime";
import Autocomplete from "react-autocomplete";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./timesheet.css";
import classNames from "classnames/bind";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Loader from "react-loader-spinner";
import Router, { useRouter } from "next/router";
import Head from "next/head";

import NotPermission from "./NotPermission";

import { CookiesProvider, useCookies } from "react-cookie";
import Admin from "layouts/Admin.js";
import LoginComponent from "../../../components/New/LoginComponent";

toast.configure();
let afterSundayCheck = true;

let dataEmployees;

let projectInfoTab1 = undefined;

const convertInputToTime = time => {
  let match = inputTime.filter(data => data.input === time);
  if (match[0] === undefined) {
    return "error";
  }
  return match[0].time;
};

const Timesheet = () => {
  const router = useRouter();
  // const projectState = "6071";
  const [projectState, setProjectState] = useState(undefined);
  const [cookies, setCookie, removeCookie] = useCookies("username");
  const [status, setStatus] = useState({
    cookies: {
      username: 0,
      password: 0,
      fullname: "",
      employeeid: 0,
    },
    permission: true,
  });
  const [stateAssignedProject, setStateAssignedProject] = useState([]);
  const getSunday = d => {
    d = new Date(d);
    let day = d.getDay(),
      diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  const date_diff_indays = (date1, date2) => {
    return Math.floor(
      (Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate()) -
        Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate())) /
        (1000 * 60 * 60 * 24)
    );
  };

  const dateCheckEditable = str => {
    const toStr = str.toLocaleString();
    const newStr =
      toStr.split("/")[0] +
      "/" +
      toStr.split("/")[1] +
      "/" +
      toStr.split("/")[2].slice(0, 4);
    const dateFromStr = new Date(newStr);
    const sundayOfSelected = getSunday(dateFromStr);
    const sundayOfToday = getSunday(now);
    if (date_diff_indays(sundayOfToday, sundayOfSelected) >= 0) {
      afterSundayCheck = true;
      return true;
    } else {
      //Turning on the lockout
      afterSundayCheck = false;
      return false;

      //Turning off the lockout
      // afterSundayCheck = true;
      // return true;
    }
  };

  const [checkState, setCheckState] = useState(true);
  const checkChange = event => {
    if (event.target.checked) {
      for (
        let i = 12;
        i <
        document.getElementsByClassName(
          "time__table__time-wrapper__target-disabled"
        ).length;
        i++
      ) {
        document
          .getElementsByClassName("time__table__time-wrapper__target-disabled")
          [i].setAttribute("disabled", true);
        document
          .getElementsByClassName("time__table__time-wrapper__target-disabled")
          [i].classList.add(
            "time__table__time-wrapper__target-disabled--disabled"
          );
      }
      setSameTime();
    } else {
      for (
        let i = 12;
        i <
        document.getElementsByClassName(
          "time__table__time-wrapper__target-disabled"
        ).length;
        i++
      ) {
        document
          .getElementsByClassName("time__table__time-wrapper__target-disabled")
          [i].removeAttribute("disabled");
        document
          .getElementsByClassName("time__table__time-wrapper__target-disabled")
          [i].classList.remove(
            "time__table__time-wrapper__target-disabled--disabled"
          );
      }
    }
    setCheckState(event.target.checked);
  };

  const columns = useMemo(
    () => [
      {
        Header: " ", //Delete Timesheet
        accessor: "TimesheetID",
      },
      {
        Header: "Employee Name",
        accessor: "EmployeeName",
      },
      {
        Header: "Position",
        accessor: "Position",
      },
      {
        Header: "Work Start",
        accessor: "WorkStart",
      },
      {
        Header: "Meal Start",
        accessor: "MealStart",
      },
      {
        Header: "Meal End",
        accessor: "MealEnd",
      },
      {
        Header: "Work End",
        accessor: "WorkEnd",
      },
      {
        Header: "Labor Hours",
        accessor: "laborHours",
      },
    ],
    []
  );

  const [data, setData] = useState(() => []);

  // Create an editable cell renderer
  const EditableCell = ({
    value: initialValue,
    row: { index },
    column: { id },
    row,
    updateMyData, // This is a custom function that we supplied to our table instance
  }) => {
    // We need to keep and update the state of the cell normally
    const [value, setValue] = useState(initialValue);

    const onCheckHour = e => {
      if (12 < parseInt(e.target.value)) {
        toast.warning(
          <div className="time__alert__table__hour-input">
            Only <strong>00 to 12</strong> can be entered into the time hour
            input.
          </div>,
          {
            position: toast.POSITION.BOTTOM_CENTER,
            hideProgressBar: true,
          }
        );
        setValue("  :" + value.slice(3, 5) + value.slice(5, 7));
      } else {
        setValue(e.target.value + ":" + value.slice(3, 5) + value.slice(5, 7));
      }
    };

    const onCheckMin = e => {
      setValue(value.slice(0, 2) + ":" + e.target.value + value.slice(5, 7));
    };

    const onCheckAmPm = e => {
      if (e.target.value === "AM") {
        setValue(value.slice(0, 2) + ":" + value.slice(3, 5) + "AM");
      } else if (e.target.value === "PM") {
        setValue(value.slice(0, 2) + ":" + value.slice(3, 5) + "PM");
      } else {
        setValue(value.slice(0, 2) + ":" + value.slice(3, 5) + e.target.value);
      }
    };

    const onChangePosition = e => {
      setValue(e.target.value);
    };

    const onChange = e => {
      setValue(e.target.value);
    };

    const onChangeSelect = value => {
      setValue(value);
      updateEmployeeData(index, id, value);
    };

    // We'll only update the external data when the input is blurred
    const onBlur = e => {
      if (document.getElementById("checkboxForSetSameTime")) {
        if (document.getElementById("checkboxForSetSameTime").checked) {
          updateMyData(index, id, value);
          setSameTime();
        } else {
          updateMyData(index, id, value);
        }
      } else {
        updateMyData(index, id, value); //important bug fix but why?
      }
    };

    const onBlurForEmployee = e => {
      updateEmployeeData(index, id, value);
    };

    const clickDeleteTimesheet = value => {
      deleteTimesheetRow(index, id);
    };

    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    if (id === "TimesheetID") {
      if (afterSundayCheck === true) {
        return (
          <DeleteForeverIcon
            color="action"
            className="time__table__delete-icon"
            value={value}
            onClick={() => clickDeleteTimesheet(value)}
          ></DeleteForeverIcon>
        );
      } else return <></>;
    } else if (id === "Position") {
      return (
        <select
          value={value}
          onChange={onChangePosition}
          onBlur={onBlur}
          className="time__table__position-dropdown"
          disabled={afterSundayCheck ? false : true}
        >
          <option value={"Director"}>Director</option>
          <option value={"PIC"}>PIC</option>
          <option value={"Associate"}>Associate</option>
        </select>
      );
    } else if (
      id === "WorkStart" ||
      id === "MealStart" ||
      id === "MealEnd" ||
      id === "WorkEnd"
    ) {
      return (
        <div className="time__table__time-wrapper">
          <InputMask
            value={value.slice(0, 2)}
            onChange={onCheckHour}
            onBlur={onBlur}
            className={
              afterSundayCheck
                ? classNames(
                    "time__table__time-wrapper__target-disabled",
                    "time__table__time-wrapper__hour-input"
                  )
                : classNames(
                    "time__table__time-wrapper__target-disabled",
                    "time__table__time-wrapper__hour-input-before-sunday"
                  )
            }
            mask="29"
            placeholder="01~12"
            formatChars={{
              2: "[0-1]",
              9: "[0-9]",
            }}
            disabled={afterSundayCheck ? false : true}
          />
          :
          <InputMask
            value={value.slice(3, 5)}
            onChange={onCheckMin}
            onBlur={onBlur}
            className={
              afterSundayCheck
                ? classNames(
                    "time__table__time-wrapper__target-disabled",
                    "time__table__time-wrapper__min-input"
                  )
                : classNames(
                    "time__table__time-wrapper__target-disabled",
                    "time__table__time-wrapper__min-input-before-sunday"
                  )
            }
            placeholder="00~50"
            mask="50"
            formatChars={{
              5: "[0-5]",
            }}
            disabled={afterSundayCheck ? false : true}
          />
          <select
            value={value.slice(5, 7)}
            onChange={onCheckAmPm}
            onBlur={onBlur}
            className={classNames(
              "time__table__time-wrapper__target-disabled",
              "time__table__ampm-dropdown"
            )}
            disabled={afterSundayCheck ? false : true}
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      );
    } else if (id === "EmployeeName") {
      return (
        <Autocomplete
          getItemValue={item => item.EmployeeName}
          items={dataEmployees}
          renderItem={(item, isHighlighted) => (
            <div
              key={item.EmployeeID}
              style={{ background: isHighlighted ? "lightgray" : "white" }}
            >
              {item.EmployeeName}
            </div>
          )}
          shouldItemRender={(item, value) =>
            item.EmployeeName.toLowerCase().indexOf(value.toLowerCase()) > -1
          }
          value={value}
          onChange={onChange}
          inputProps={{ onBlur: onBlurForEmployee }}
          onSelect={val => onChangeSelect(val)}
          renderInput={props => {
            return (
              <input
                className={
                  afterSundayCheck
                    ? "time__table__employee-input"
                    : "time__table__employee-input-before-sunday"
                }
                disabled={afterSundayCheck ? false : true}
                {...props}
              ></input>
            );
          }}
        />
      );
    } else if (id === "laborHours") {
      let laborDate = (
        (new Date(convertInputToTime(row.values.WorkEnd).replace(" ", "T")) -
          new Date(convertInputToTime(row.values.WorkStart).replace(" ", "T")) -
          (new Date(convertInputToTime(row.values.MealEnd).replace(" ", "T")) -
            new Date(
              convertInputToTime(row.values.MealStart).replace(" ", "T")
            ))) /
        3600000
      ).toFixed(2);
      if (parseFloat(laborDate) < 0) {
        laborDate = (parseFloat(laborDate) + 24).toFixed(2);
      }

      return (
        <div
          className={classNames([
            "time__table__labor-hours-input",
            "time__table__labor-hours-input",
          ])}
        >
          {laborDate}
        </div>
      );
    }
  };

  // Set our editable cell renderer as the default Cell renderer
  const defaultColumn = {
    Cell: EditableCell,
  };

  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setData(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };

  const updateEmployeeData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setData(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
            ["EmployeeID"]: convertEmployeeNameToID(value),
          };
        }
        return row;
      })
    );
  };

  const convertEmployeeNameToID = name => {
    let employee = dataEmployees.find(
      employee => name === employee.EmployeeName
    );
    if (employee) {
      return employee.EmployeeID;
    } else {
      return 0;
    }
  };

  const setSameTime = () => {
    setData(old =>
      old.map((row, index) => {
        return {
          ...old[index],
          WorkStart: old[0].WorkStart,
          MealStart: old[0].MealStart,
          MealEnd: old[0].MealEnd,
          WorkEnd: old[0].WorkEnd,
        };
      })
    );
  };

  const getRandomIntInclusive = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
  };

  const addTimesheetRow = () => {
    setData([
      ...data,
      {
        TimesheetID: 0,
        EmployeeID: 0,
        EmployeeName: "",
        Date: formatDate(selectedDate),
        Position: "Director",
        WorkStart: data[0] !== undefined ? data[0].WorkStart : "07:00AM",
        MealStart: data[0] !== undefined ? data[0].MealStart : "12:00PM",
        MealEnd: data[0] !== undefined ? data[0].MealEnd : "01:00PM",
        WorkEnd: data[0] !== undefined ? data[0].WorkEnd : "05:00PM",
        InsertID: getRandomIntInclusive(1, 10000000),
      },
    ]);
  };

  const deleteTimesheetRow = (rowIndex, columnId) => {
    setData(old =>
      old.filter((row, index) => {
        return index !== rowIndex;
      })
    );
  };

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      updateMyData,
    }
    // useBlockLayout
  );
  // Render the UI for your table

  const now = new Date().toLocaleString({
    timeZone: "America/Los_Angeles",
  });

  const [selectedDate, setSelectedDate] = useState(now);

  const handleDateChange = date => {
    setSelectedDate(date);
  };

  useEffect(() => {
    if (status.cookies.username !== 0) {
      if (status.cookies.username !== undefined) {
        axios({
          method: "post",
          url: `/api/daily-report/signin`,
          timeout: 5000, // 5 seconds timeout
          headers: {},
          data: {
            Username: status.cookies.username,
            Password: status.cookies.password,
          },
        }).then(response => {
          const assignedProject = response.data.result.recordsets[1];
          setStateAssignedProject(response.data.result.recordsets[1]);

          if (
            response.data.result.recordsets[1].length > 0 &&
            projectState === undefined
          ) {
            if (router.query.pid) {
              setProjectState(router.query.pid);
            } else {
              setProjectState(
                "" + response.data.result.recordsets[1][0].ProjectID
              );
            }
          }

          if (status.permission === true && projectState !== undefined) {
            let check = 0;
            for (let i = 0; i < assignedProject.length; i++) {
              if (assignedProject[i].ProjectID.toString() === projectState) {
                check++;
                break;
              }
            }
            if (check === 0) {
              setStatus(prevState => ({
                ...prevState,
                permission: false,
              }));
            }
          }
        });
      }
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

    if (
      status.permission === true &&
      projectState !== undefined &&
      selectedDate !== undefined
    ) {
      const fetchData = async () => {
        let result = await axios({
          method: "get",
          url: `/api/timesheets?selectedDate=${formatDate(
            selectedDate
          )}&projectID=${projectState}`,
          timeout: 5000, // 5 seconds timeout
          headers: {},
        });
        if (result.data.result[0].length === 0) {
          setCheckState(true);
        } else {
          setCheckState(false);
        }
        setData(result.data.result[0]);
        dataEmployees = result.data.result[1];
        projectInfoTab1 = result.data.result[2];
        router.push(`?pid=${projectState}`);
      };

      trackPromise(fetchData());
    } else {
      setData([]);
    }
  }, [selectedDate, projectState, status]);

  const applyCheckState = () => {
    if (checkState) {
      for (
        let i = 12;
        i <
        document.getElementsByClassName(
          "time__table__time-wrapper__target-disabled"
        ).length;
        i++
      ) {
        document
          .getElementsByClassName("time__table__time-wrapper__target-disabled")
          [i].setAttribute("disabled", true);
        document
          .getElementsByClassName("time__table__time-wrapper__target-disabled")
          [i].classList.add(
            "time__table__time-wrapper__target-disabled--disabled"
          );
      }
    } else {
      for (
        let i = 12;
        i <
        document.getElementsByClassName(
          "time__table__time-wrapper__target-disabled"
        ).length;
        i++
      ) {
        document
          .getElementsByClassName("time__table__time-wrapper__target-disabled")
          [i].removeAttribute("disabled");
        document
          .getElementsByClassName("time__table__time-wrapper__target-disabled")
          [i].classList.remove(
            "time__table__time-wrapper__target-disabled--disabled"
          );
      }
    }
  };
  useEffect(() => {
    applyCheckState();
  }, [data]);

  const handleSaveTimesheetBtn = () => {
    let checkEmployeeName = data.find(employee => employee.EmployeeID === 0);
    let checkTime = 0;
    for (
      let i = 0;
      i <
      document.getElementsByClassName("time__table__labor-hours-input").length;
      i++
    ) {
      if (
        document.getElementsByClassName("time__table__labor-hours-input")[i]
          .innerText === "NaN"
      )
        checkTime++;
    }
    if (checkEmployeeName) {
      toast.error(
        <div className="time__alert__table__employee-input">
          Unable to save. <br /> Please check <strong>employee name </strong>
          again.
        </div>,
        {
          position: toast.POSITION.BOTTOM_CENTER,
          hideProgressBar: true,
        }
      );
      return null;
    } else if (checkTime) {
      toast.error(
        <div className="time__alert__table__time-wrapper">
          Unable to save. <br /> Please check the <strong>time input </strong>
          again.
        </div>,
        {
          position: toast.POSITION.BOTTOM_CENTER,
          hideProgressBar: true,
        }
      );
      return null;
    } else {
      let promises = [];

      const fetchData = async () => {
        promises.push(
          await axios({
            method: "delete",
            url: `/api/timesheets`,
            timeout: 5000, // 5 seconds timeout
            headers: {},
            data: {
              ProjectID: projectState,
              Date: formatDate(selectedDate),
            },
          })
        );
        for (let i = 0; i < data.length; i++) {
          promises.push(
            await axios({
              method: "post",
              url: `/api/timesheets`,
              timeout: 5000, // 5 seconds timeout
              headers: {},
              data: {
                ProjectID: projectState,
                EmployeeID: data[i].EmployeeID,
                Position: data[i].Position,
                Date: formatDate(selectedDate),
                WorkStart: data[i].WorkStart,
                WorkEnd: data[i].WorkEnd,
                MealStart: data[i].MealStart,
                MealEnd: data[i].MealEnd,
              },
            })
          );
        }
      };

      trackPromise(fetchData());
      trackPromise(
        Promise.all(promises).then(result => {
          toast.success(
            <div className="time__alert__complete">
              <strong>Save Complete</strong>
            </div>,
            {
              position: toast.POSITION.BOTTOM_CENTER,
              hideProgressBar: true,
            }
          );
        })
      );
    }

    axios({
      method: "post",
      url: `/api/log-daily-reports`,
      timeout: 5000, // 5 seconds timeout
      headers: {},
      data: {
        EmployeeID: status.cookies.employeeid,
        ProjectID: projectState,
        Date: formatDate(selectedDate),
        Category: "Timesheet",
        Action: "update",
      },
    });

    setTimeout(() => {
      applyCheckState();
    }, 600);
  };

  const { promiseInProgress } = usePromiseTracker();

  const signin = async (username, password) => {
    await axios({
      method: "post",
      url: `/api/dashboard/signin`,
      timeout: 5000, // 5 seconds timeout
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
    <>
      {status.cookies.username === undefined ||
      status.cookies.employeeid === undefined ? (
        <LoginComponent signin={signin} />
      ) : !status.permission ? (
        <NotPermission path="timesheet" />
      ) : (
        <div style={{ overflowX: "auto" }}>
          <div id="time__mainDiv">
            {promiseInProgress || !projectState ? (
              data.length === 0 ? (
                <p
                  style={{ marginTop: "50px", fontWeight: "700" }}
                  className="time__no-permission"
                >
                  You have NO permission
                </p>
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Loader
                    type="Audio"
                    color="#4e88de"
                    height="100"
                    width="100"
                  />
                </div>
              )
            ) : (
              <>
                <select
                  value={projectState}
                  onChange={e => setProjectState(e.target.value)}
                  style={{
                    marginTop: "30px",
                    fontFamily: "Roboto, sans-serif",
                    fontSize: "medium",
                    display: "inline-block",
                    color: "#74646e",
                    border: "1px solid #c8bfc4",
                    borderRadius: "4px",
                    boxShadow: "inset 1px 1px 2px #ddd8dc",
                    background: "#fff",
                    zIndex: "1",
                    position: "relative",
                  }}
                >
                  {stateAssignedProject.map(item => {
                    return (
                      <option
                        value={item.ProjectID}
                        key={item.ProjectID}
                        projectgroup={item.ProjectGroup}
                        projectname={item.ProjectName}
                      >
                        {item.ProjectID} &emsp;[{item.ProjectGroup}]&ensp;
                        {item.ProjectName}
                      </option>
                    );
                  })}
                </select>
                <div className="time__header">
                  {/* <div className="time__header__left">
                    <h3 className="time__header__left__project-id">
                      <span
                        onClick={() => {
                          goMain();
                        }}
                        className="time__header__left__project-id__value"
                      >
                        {projectState}
                      </span>
                    </h3>

                    {projectInfoTab1 !== undefined &&
                    projectInfoTab1.length !== 0 ? (
                      <>
                        <h4 className="time__header__left__project-group">
                          [{projectInfoTab1[0].ProjectGroup}]
                        </h4>
                        <h4 className="time__header__left__project-name">
                          {projectInfoTab1[0].ProjectName}
                        </h4>
                      </>
                    ) : (
                      ""
                    )}
                  </div> */}
                  <div className="time__header__right">
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        className={
                          dateCheckEditable(selectedDate)
                            ? "time__header__right__save-btn"
                            : "time__header__right__save-btn-before-sunday"
                        }
                        onClick={handleSaveTimesheetBtn}
                        startIcon={<SaveIcon />}
                      >
                        Save
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        className={
                          dateCheckEditable(selectedDate)
                            ? "time__header__right__add-btn"
                            : "time__header__right__add-btn-before-sunday"
                        }
                        onClick={addTimesheetRow}
                        startIcon={<AddIcon />}
                      >
                        Add&nbsp;Row
                      </Button>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={checkState}
                            onChange={checkChange}
                            name="checkbox"
                            color="secondary"
                            id="checkboxForSetSameTime"
                          />
                        }
                        label="Set Same Time of All"
                        className={
                          dateCheckEditable(selectedDate)
                            ? "time__header__right__checkbox"
                            : "time__header__right__checkbox-before-sunday"
                        }
                      />
                    </>
                    {/* )} */}
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <DatePicker
                        margin="normal"
                        id="datePickerDialog"
                        format="MM/dd/yyyy"
                        value={selectedDate}
                        onChange={handleDateChange}
                        className="time__header__right__date-picker"
                        autoOk={true}
                        okLabel=""
                      />
                    </MuiPickersUtilsProvider>
                    <p className="time__header__right__label-date-picker">
                      Date
                    </p>
                  </div>
                </div>
                <div className="time__table">
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        {headerGroups.map(headerGroup => (
                          <TableRow {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                              <TableCell {...column.getHeaderProps()}>
                                {column.render("Header")}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableHead>
                      <TableBody>
                        {rows.map((row, i) => {
                          prepareRow(row);
                          return (
                            <TableRow {...row.getRowProps()}>
                              {row.cells.map(cell => {
                                return (
                                  <TableCell {...cell.getCellProps()}>
                                    {cell.render("Cell")}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
Timesheet.layout = Admin;
export default Timesheet;
