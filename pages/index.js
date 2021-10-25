import React from "react";
import Router from "next/router";
import { CookiesProvider, useCookies } from "react-cookie";

export default function Index() {
  const [cookies, setCookie, removeCookie] = useCookies("username");
  React.useEffect(() => {
    {
      cookies.username ? Router.push("/home/p0/start") : Router.push("/login");
    }
  });

  return <div />;
}
