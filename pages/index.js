import React from "react";
import Router from "next/router";
import { CookiesProvider, useCookies } from "react-cookie";

export default function Index() {
  const [cookies, setCookie, removeCookie] = useCookies("username");
  React.useEffect(() => {
    {
      cookies.username ? Router.push("/home/dashboard") : Router.push("/login");
    }
  });

  return <div />;
}
