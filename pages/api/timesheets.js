const mssql = require("mssql");
const dbserver = require("../../dbConfig.js");

const timesheetHandler = (req, res) => {
  const { method, body } = req;
  return new Promise(resolve => {
    switch (method) {
      case "GET":
        mssql.connect(dbserver.dbConfig, err => {
          if (err) {
            console.error(err);
            return resolve();
          }
          const request = new mssql.Request();

          const selectedDate = req.query.selectedDate;
          const projectID = req.query.projectID;

          const query = `EXEC [Hammer].[dbo].[Timesheet_SelectByDate]
          '${selectedDate}',  ${projectID}`;

          request.query(query, (err, recordset) => {
            if (err) {
              console.error(err);
              return resolve();
            }
            res.status(200).json({
              result: recordset.recordsets,
            });
            return resolve();
          });
        });
        break;

      case "POST":
        mssql.connect(dbserver.dbConfig, err => {
          if (err) {
            console.error(err);
            return resolve();
          }
          const request = new mssql.Request();

          const query = `EXEC [Hammer].[dbo].[Timesheet_Insert]
          ${body.ProjectID}, ${body.EmployeeID}, "${body.Position}", "${body.Date}", "${body.WorkStart}", "${body.WorkEnd}", "${body.MealStart}", "${body.MealEnd}" `;
          /* --Params--
          @projectID int,
          @employeeID int,
          @position nvarchar(100),
          @date date,
          @workStart time(0),
          @workEnd time(0),
          @mealStart time(0),
          @mealEnd time(0)
          */

          request.query(query, (err, recordset) => {
            if (err) {
              console.error(err);
              return resolve();
            }
            res.status(200).json({
              message: "Success, the timesheet has been created.",
            });
            return resolve();
          });
        });
        break;

      case "DELETE":
        mssql.connect(dbserver.dbConfig, err => {
          if (err) {
            console.error(err);
            return resolve();
          }
          const request = new mssql.Request();

          const query = `EXEC [Hammer].[dbo].[Timesheet_Delete]
          ${body.ProjectID}, "${body.Date}"`;
          /* --Params--
          @projectID int,
          @date date,
          */

          request.query(query, (err, recordset) => {
            if (err) {
              console.error(err);
              return resolve();
            }
            res.status(200).json({
              message: "DELETE Success.",
            });
            return resolve();
          });
        });
        break;

      default:
        res.setHeader("Allow", ["GET", "POST", "DELETE"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        res.status(404).end(`Failed`);
        resolve();
    }
  });
};

export default timesheetHandler;
