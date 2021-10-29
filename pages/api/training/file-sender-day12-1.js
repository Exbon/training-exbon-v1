let fs = require("fs");
const fsPromises = fs.promises;
const pdf2base64 = require("pdf-to-base64");
let axios = require("axios");

const fileSender = (req, res) => {
  const { method, body, query } = req;
  return new Promise(async resolve => {
    switch (method) {
      case "GET":
        fs.readFile("./public/CO Submission.pdf", function (err, data) {
          if (err) throw err;

          // // Encode to base64
          // var encodedImage = new Buffer(data, "binary").toString("base64");

          // // Decode from base64
          // var decodedImage = new Buffer(encodedImage, "base64").toString(
          //   "binary"
          // );

          axios({
            method: "post",
            url: `https://www.wrike.com/api/v4/tasks/${query.taskid}/attachments`,
            timeout: 15000, // 5 seconds timeout
            headers: {
              Authorization:
                "bearer eyJ0dCI6InAiLCJhbGciOiJIUzI1NiIsInR2IjoiMSJ9.eyJkIjoie1wiYVwiOjIxMjg5MzIsXCJpXCI6NjYyMzk5NixcImNcIjo0NTkzODAxLFwidVwiOjQyODM2NzEsXCJyXCI6XCJVU1wiLFwic1wiOltcIldcIixcIkZcIixcIklcIixcIlVcIixcIktcIixcIkNcIixcIkFcIixcIkxcIl0sXCJ6XCI6W10sXCJ0XCI6MH0iLCJpYXQiOjE1NzA0NTc4NDR9.ayTohiITZBNn5f2axYfdDwUEsXC-WSlMFocdijGI0ic",
              "Content-Type": "application/pdf",
              "X-File-Name": "CO Submission.pdf",
            },
            data: data,
          });
        });
        res.status(200).json(
          //for preventing Timeout
          { result: 1 }
        );

        break;

      default:
        res.setHeader("Allow", ["GET"]);
    }
  });
};

export default fileSender;
