import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Admin from "layouts/Admin.js";
import LoginComponent from "../../components/New/LoginComponent";
import { CookiesProvider, useCookies } from "react-cookie";
import axios from "axios";

const LoginExample = () => {
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
        }).then(response => {});
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

  return (
    <>
      {status.cookies.username === undefined ||
      status.cookies.employeeid === undefined ? (
        <LoginComponent signin={signin} />
      ) : (
        <div></div>
      )}
    </>
  );
};

LoginExample.layout = Admin;

export default LoginExample;
