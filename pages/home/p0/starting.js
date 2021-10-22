import React from "react";
import Admin from "layouts/Admin.js";
import { Button } from "@material-ui/core";
import Link from "next/link";

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
      <Link href="../p1/July122021">
        <Button
          variant="contained"
          color="primary"
          style={{ alignSelf: "center", width: "30%" }}
        >
          Continue
        </Button>
      </Link>
    </div>
  );
}
starting.layout = Admin;
export default starting;
