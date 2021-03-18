import { useState, useEffect, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Admin from "layouts/Admin.js";
import LoginComponent from "../../components/New/LoginComponent";
import { CookiesProvider, useCookies } from "react-cookie";
import axios from "axios";
import { useTable, useBlockLayout } from "react-table";
import { formatDate } from "../../components/New/formatDate";
import "./dashboard.css";

const Dashboard = () => {
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

  useEffect(() => {
    if (status.cookies.username !== 0) {
      if (status.cookies.username !== undefined) {
        axios({
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
  }, [status, cookies]);

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
        width: 50,
      },
      {
        Header: "Project Name",
        accessor: "ProjectName",
        width: 300,
      },
      {
        Header: "Contract Amount",
        accessor: "ContractAmount",
        width: 100,
      },
      {
        Header: "Position",
        accessor: "Position",
      },

      {
        Header: "Baseline Cost",
        accessor: "BaselineCost",
      },
      {
        Header: "EEAC",
        accessor: "EEAC",
      },
      {
        Header: "CV",
        accessor: "CV",
      },
      {
        Header: "CPI",
        accessor: "CPI",
      },
      {
        Header: "Completion %",
        accessor: "WorkCompletion",
      },
      {
        Header: "ESPI",
        accessor: "ESPI",
      },
      {
        Header: "Deadline",
        accessor: "Deadline",
      },
      {
        Header: "Start Date",
        accessor: "StartDate",
      },
      {
        Header: "Finish Date",
        accessor: "FinishDate",
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

    if (id === "ContractAmount") {
      return <div style={{ textAlign: "right" }}>{Math.round(value)}</div>;
    } else if (id === "BaselineCost") {
      return <div style={{ textAlign: "right" }}>{Math.round(value)}</div>;
    } else if (id === "EEAC") {
      return <div style={{ textAlign: "right" }}>{Math.round(value)}</div>;
    } else if (id === "CV") {
      return <div style={{ textAlign: "right" }}>{Math.round(value)}</div>;
    } else if (id === "CPI") {
      return <div style={{ textAlign: "right" }}>{Math.round(value)}</div>;
    } else if (id === "WorkCompletion") {
      return <div style={{ textAlign: "right" }}>{value.toFixed(2)}</div>;
    } else if (id === "ESPI") {
      return <div style={{ textAlign: "right" }}>{value.toFixed(2)}</div>;
    } else if (id === "Deadline") {
      return <div>{formatDate(value)}</div>;
    } else if (id === "StartDate") {
      return <div>{formatDate(value)}</div>;
    } else if (id === "FinishDate") {
      return <div>{formatDate(value)}</div>;
    }
    return <div>{value}</div>;
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

  return (
    <>
      {status.cookies.username === undefined ||
      status.cookies.employeeid === undefined ? (
        <LoginComponent signin={signin} />
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps()}>
                      {column.render("Header")}
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
