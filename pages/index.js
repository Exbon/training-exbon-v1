import React from "react";
import Router from "next/router";
import { CookiesProvider, useCookies } from "react-cookie";

export default function Index() {
  const [cookies, setCookie, removeCookie] = useCookies("username");
  React.useEffect(() => {
    {
      cookies.username
        ? Router.push("/home/project/July012021")
        : Router.push("/login");
    }
  });

  return <div />;
}
