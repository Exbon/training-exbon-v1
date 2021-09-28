import Link from "next/link";
import Admin from "layouts/Admin.js";
import "./NotPermission.css";
const NotPermission = ({ path }) => {
  return (
    <div className="notpermit">
      <h1>No permissions</h1>
      <a
        href={
          path === "dashboard"
            ? "/home/project/July012021"
            : `/home/dailyreport/${path}`
        }
      >
        Go to main page
      </a>
    </div>
  );
};
NotPermission.layout = Admin;
export default NotPermission;
