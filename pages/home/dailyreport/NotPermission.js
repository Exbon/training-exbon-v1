import Link from "next/link";

const NotPermission = ({ path }) => {
  return (
    <>
      <h1>No permissions</h1>
      <a href={`/home/dailyreport/${path}`}>Go to main page</a>
    </>
  );
};

export default NotPermission;
