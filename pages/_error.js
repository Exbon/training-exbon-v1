import React from "react";
import Router from "next/router";

export default function _error() {
  React.useEffect(() => {
    Router.push("/home/project/July012021");
  });

  return <div />;
}
