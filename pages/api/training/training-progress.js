const mssql = require("mssql");
const dbserver = require("../../../dbConfig.js");

const trainingProgressHandler = (req, res) => {
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

          const query = `EXEC [Training].[dbo].[TrainingProgress_SelectByEmployeeID]
           ${req.query.employeeID}, ${req.query.day}, ${req.query.part}`;
          /* --Params--
          	@employeeID int,
          	@day int,
          */

          request.query(query, (err, recordset) => {
            if (err) {
              console.error(err);
              return resolve();
            }
            res.status(200).json({
              result: recordset,
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

          const query = `EXEC [Training].[dbo].[TrainingProgress_Insert]
           ${body.employeeID}, ${body.day}, ${body.part}`;

          /* --Params--
          	@employeeID int,
            @day int,
            @part int,
          */

          request.query(query, (err, recordset) => {
            if (err) {
              console.error(err);
              return resolve();
            }
            res.status(200).json({
              result: recordset,
            });
            return resolve();
          });
        });
        break;

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        res.status(404).end(`Failed`);
        resolve();
    }
  });
};

export default trainingProgressHandler;
