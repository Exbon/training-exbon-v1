import React from "react";
import Admin from "layouts/Admin.js";
import { Button } from "@material-ui/core";
import Link from "next/link";
import axios from "axios";
import { CookiesProvider, useCookies } from "react-cookie";

function starting() {
  const [cookies, setCookie, removeCookie] = useCookies();
  const handleEmail = () => {
    axios({
      method: "post",
      url: `/api/email-sender2`,
      timeout: 5000, // 5 seconds timeout
      headers: {},
      data: {
        username: cookies.username,
      },
    });
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        width: "100%",
        height: "80vh",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Link href="../p1/July122021">
        <Button
          variant="contained"
          color="primary"
          style={{ alignSelf: "center", width: "30%" }}
          onClick={() => handleEmail()}
        >
          Continue
        </Button>
      </Link>
    </div>
  );
}
starting.layout = Admin;
export default starting;
