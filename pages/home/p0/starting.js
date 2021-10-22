import React from "react";
import Admin from "layouts/Admin.js";
import { Button } from "@material-ui/core";

function starting() {
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
      <Button
        variant="contained"
        color="primary"
        style={{ alignSelf: "center", width: "30%" }}
      >
        Continue
      </Button>
    </div>
  );
}
starting.layout = Admin;
export default starting;
