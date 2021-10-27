let fs = require("fs");
const path = require("path");
const notes = "./assets/img/training/CO Submission.pdf";

const getFile = (req, res) => {
  const { method, body } = req;
  return new Promise(resolve => {
    switch (method) {
      case "GET":
        var writeStream = fs.createWriteStream(
          "./assets/img/training/CO Submission.pdf"
        );
        req.pipe(writeStream);

        res.status(200).json({
          //for preventing Timeout
          result: writeStream,
        });
        break;

      default:
        res.setHeader("Allow", ["GET"]);
    }
  });
};

export default getFile;
