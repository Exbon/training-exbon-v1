import React from "react";
import Router from "next/router";

export default function _error() {
  React.useEffect(() => {
    Router.push("/home/p0/July112021");
  });

  return <div />;
}
