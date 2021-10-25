/*!

=========================================================
* * NextJS Material Dashboard v1.1.0 based on Material Dashboard React v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/nextjs-material-dashboard
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/nextjs-material-dashboard/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import React, { useState, useEffect } from "react";
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import EventNoteIcon from "@material-ui/icons/EventNote";
import ScheduleIcon from "@material-ui/icons/Schedule";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import BubbleChart from "@material-ui/icons/BubbleChart";
import LocationOn from "@material-ui/icons/LocationOn";
import Notifications from "@material-ui/icons/Notifications";
import Unarchive from "@material-ui/icons/Unarchive";
import Language from "@material-ui/icons/Language";
import WorkIcon from "@material-ui/icons/Work";
import CloudIcon from "@material-ui/icons/Cloud";
import WatchLaterIcon from "@material-ui/icons/WatchLater";
import AssignmentIcon from "@material-ui/icons/Assignment";
import ExposureIcon from "@material-ui/icons/Exposure";
import EditIcon from "@material-ui/icons/Edit";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import SyncProblemIcon from "@material-ui/icons/SyncProblem";
// function getCookie(cname) {
//   var name = cname + "=";
//   var decodedCookie = decodeURIComponent(document.cookie);
//   var ca = decodedCookie.split(";");
//   for (var i = 0; i < ca.length; i++) {
//     var c = ca[i];
//     while (c.charAt(0) == " ") {
//       c = c.substring(1);
//     }
//     if (c.indexOf(name) == 0) {
//       return c.substring(name.length, c.length);
//     }
//   }
//   return "";
// }

const dashboardRoutes = [
  {
    path: "/p0/Day7",
    name: "Day 7",
    icon: Dashboard,
    layout: "/home",
  },
  {
    path: "/p0/Day8",
    name: "Day 8",
    icon: Dashboard,
    layout: "/home",
  },
  {
    path: "/p0/Day9",
    name: "Day 9",
    icon: Dashboard,
    layout: "/home",
  },
  {
    path: "/p0/Day10",
    name: "Day 10",
    icon: Dashboard,
    layout: "/home",
  },
  // {
  //   path: "/p0/July092021",
  //   name: "Change Order",
  //   icon: SyncProblemIcon,
  //   layout: "/home",
  // },
  // {
  //   path: "/p0/July112021",
  //   name: "Sample",
  //   icon: Dashboard,
  //   layout: "/home",
  // },
  // {
  //   path: "/calendar",
  //   name: "Calendar",
  //   icon: EventNoteIcon,
  //   layout: "/home",
  // },
  // {
  //   path: "/dailyreport/task-completion",
  //   name: "Daily Report",
  //   icon: ScheduleIcon,
  //   layout: "/home",
  // },
  // {
  //   path: "/typography",
  //   name: "Typography",
  //   rtlName: "طباعة",
  //   icon: LibraryBooks,
  //   layout: "/dashboard",
  // },
  // {
  //   path: "/icons",
  //   name: "Icons",
  //   rtlName: "الرموز",
  //   icon: BubbleChart,
  //   layout: "/dashboard",
  // },
  // {
  //   path: "/maps",
  //   name: "Maps",
  //   rtlName: "خرائط",
  //   icon: LocationOn,
  //   layout: "/dashboard",
  // },
  // {
  //   path: "/notifications",
  //   name: "Notifications",
  //   rtlName: "إخطارات",
  //   icon: Notifications,
  //   layout: "/dashboard",
  // },
  // {
  //   path: "/rtl-page",
  //   name: "RTL Support",
  //   rtlName: "پشتیبانی از راست به چپ",
  //   icon: Language,
  //   layout: "/rtl",
  // },
  // {
  //   path: "/upgrade-to-pro",
  //   name: "Upgrade To PRO",
  //   rtlName: "التطور للاحترافية",
  //   icon: Unarchive,
  //   layout: "/dashboard",
  // },
];

export default dashboardRoutes;
