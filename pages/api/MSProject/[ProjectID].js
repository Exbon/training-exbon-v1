const mssql = require("mssql");
const dbserver = require("../../../dbConfig.js");

const MSProjectHandler = (req, res) => {
  const { method, body, query } = req;
  return new Promise(resolve => {
    switch (method) {
      case "GET":
        mssql.connect(dbserver.dbConfig, err => {
          if (err) {
            console.error(err);
            return resolve();
          }
          const request = new mssql.Request();

          const sqlQuery = `EXEC [Hammer].[dbo].[Dashboard_MSProject_SelectByProjectID]
                            ${query.ProjectID}`;

          request.query(sqlQuery, (err, recordset) => {
            if (err) {
              console.error(err);
              return resolve();
            }
            const response = recordset;
            res.status(200).json(response);
            return resolve();
          });
        });
        break;

      default:
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        res.status(404).end(`Failed`);
        resolve();
    }
  });
};

export default MSProjectHandler;
