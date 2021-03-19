import { useState, useEffect, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Admin from "layouts/Admin.js";
import LoginComponent from "../../components/New/LoginComponent";
import { CookiesProvider, useCookies } from "react-cookie";
import axios from "axios";
import { useTable, useBlockLayout } from "react-table";
import { formatDate } from "../../components/New/formatDate";
import Router, { useRouter } from "next/router";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Loader from "react-loader-spinner";
import "./dashboard.css";

const Dashboard = () => {
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
      }).then(response => {
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
      });
    promises.push(fetchData());
    trackPromise(Promise.all(promises).then(() => {}));
  };

  useEffect(() => {
    let promises = [];

    const fetchData = async () => {
      if (status.cookies.username !== 0) {
        if (status.cookies.username !== undefined) {
          if (router.query.status !== "completed") {
            //In Progress
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
              setData(response.data.result.recordsets[1]);
            });
          } else {
            await axios({
              method: "post",
              url: `/api/dashboard/ms-completed`,
              timeout: 5000, // 5 seconds timeout
              headers: {},
              data: {
                Username: status.cookies.username,
                Password: status.cookies.password,
              },
            }).then(response => {
              setData(response.data.result.recordsets[0]);
            });
          }
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
    };
    promises.push(fetchData());
    trackPromise(Promise.all(promises).then(() => {}));
  }, [status, cookies, router.query]);

  const columns = useMemo(
    () => [
      {
        Header: "Project Group",
        accessor: "ProjectGroup",
        width: 120,
      },
      {
        Header: "Project ID",
        accessor: "ProjectID",
        width: 70,
      },
      {
        Header: "Project Name",
        accessor: "ProjectName",
        width: 300,
      },
      {
        Header: "Contract Amount",
        accessor: "ContractAmount",
        width: 70,
      },
      {
        Header: "Position",
        accessor: "Position",
        width: 80,
      },

      {
        Header: "Baseline Cost",
        accessor: "BaselineCost",
        width: 100,
      },
      {
        Header: "EEAC",
        accessor: "EEAC",
        width: 100,
      },
      {
        Header: "CV",
        accessor: "CV",
        width: 100,
      },
      {
        Header: "CPI",
        accessor: "CPI",
        width: 60,
      },
      {
        Header: "Completion %",
        accessor: "WorkCompletion",
        width: 95,
      },
      {
        Header: "ESPI",
        accessor: "ESPI",
        width: 60,
      },
      {
        Header: "Deadline",
        accessor: "Deadline",
        width: 90,
      },
      {
        Header: "Start Date",
        accessor: "StartDate",
        width: 90,
      },
      {
        Header: "Finish Date",
        accessor: "FinishDate",
        width: 90,
      },
    ],
    []
  );

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

  const EditableCell = ({
    value: initialValue,
    row: { index },
    column: { id },
    updateMyData, // This is a custom function that we supplied to our table instance
  }) => {
    // We need to keep and update the state of the cell normally
    const [value, setValue] = useState(initialValue);

    const onChange = e => {
      setValue(e.target.value);
    };

    // We'll only update the external data when the input is blurred
    const onBlur = () => {
      updateMyData(index, id, value);
    };

    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);
    if (id === "ProjectGroup") {
      return (
        <div className="dashboard__table__project-group">
          <span>{value}</span>
        </div>
      );
    } else if (id === "ProjectID") {
      return (
        <div className="dashboard__table__project-id">
          <span>{value}</span>
        </div>
      );
    } else if (id === "ContractAmount") {
      return (
        <div className="dashboard__table__contract-amount">
          <span>{new Intl.NumberFormat("en").format(Math.round(value))}</span>
        </div>
      );
    } else if (id === "Position") {
      return (
        <div className="dashboard__table__postion">
          <span>{value}</span>
        </div>
      );
    } else if (id === "BaselineCost") {
      return (
        <div className="dashboard__table__baseline-cost">
          <span>{new Intl.NumberFormat("en").format(Math.round(value))}</span>
        </div>
      );
    } else if (id === "EEAC") {
      return (
        <div className="dashboard__table__eeac">
          <span>{new Intl.NumberFormat("en").format(Math.round(value))}</span>
        </div>
      );
    } else if (id === "CV") {
      return (
        <div className="dashboard__table__cv">
          <span>{new Intl.NumberFormat("en").format(Math.round(value))}</span>
        </div>
      );
    } else if (id === "CPI") {
      return (
        <div className="dashboard__table__cpi">
          <span>{Math.round(value)}</span>
        </div>
      );
    } else if (id === "WorkCompletion") {
      return (
        <div className="dashboard__table__work-completion">
          <span>{value.toFixed(2)}</span>
        </div>
      );
    } else if (id === "ESPI") {
      return (
        <div className="dashboard__table__espi">
          <span>{value.toFixed(2)}</span>
        </div>
      );
    } else if (id === "Deadline") {
      return (
        <div className="dashboard__table__deadline">
          <span>{formatDate(value)}</span>
        </div>
      );
    } else if (id === "StartDate") {
      return (
        <div className="dashboard__table__start-date">
          <span>{formatDate(value)}</span>
        </div>
      );
    } else if (id === "FinishDate") {
      return (
        <div className="dashboard__table__finish-date">
          <span>{formatDate(value)}</span>
        </div>
      );
    }
    return (
      <div className="dashboard__table__data-wrapper">
        <span>{value}</span>
      </div>
    );
  };

  // Set our editable cell renderer as the default Cell renderer
  const defaultColumn = {
    Cell: EditableCell,
  };

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
    },
    useBlockLayout
  );
  const { promiseInProgress } = usePromiseTracker();
  return (
    <>
      {promiseInProgress ? (
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
            type="BallTriangle"
            color="#31c4b0"
            height="150"
            width="150"
          />
        </div>
      ) : status.cookies.username === undefined ||
        status.cookies.employeeid === undefined ? (
        <LoginComponent signin={signin} />
      ) : (
        <div className="dashboard__table" style={{ overflowX: "auto" }}>
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps()}>
                      <div>
                        <span>{column.render("Header")}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row, i) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map(cell => {
                      return (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

Dashboard.layout = Admin;

export default Dashboard;
