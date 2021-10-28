let fs = require("fs");
const pdf2base64 = require("pdf-to-base64");
let axios = require("axios");

const getFile = (req, res) => {
  const { method, body, query } = req;
  return new Promise(async resolve => {
    switch (method) {
      case "GET":
        const file = fs.readFileSync("./public/CO Submission.pdf");
        const blob = Buffer.from(file);

        let formData = new FormData();
        formData.append("pdf", blob);
        await axios({
          method: "post",
          url: `https://www.wrike.com/api/v4/tasks/${query.taskid}/attachments`,
          timeout: 15000, // 5 seconds timeout
          headers: {
            Authorization:
              "bearer eyJ0dCI6InAiLCJhbGciOiJIUzI1NiIsInR2IjoiMSJ9.eyJkIjoie1wiYVwiOjIxMjg5MzIsXCJpXCI6NjYyMzk5NixcImNcIjo0NTkzODAxLFwidVwiOjQyODM2NzEsXCJyXCI6XCJVU1wiLFwic1wiOltcIldcIixcIkZcIixcIklcIixcIlVcIixcIktcIixcIkNcIixcIkFcIixcIkxcIl0sXCJ6XCI6W10sXCJ0XCI6MH0iLCJpYXQiOjE1NzA0NTc4NDR9.ayTohiITZBNn5f2axYfdDwUEsXC-WSlMFocdijGI0ic",
            // "Content-Type": "application/x-binary",
            "Content-Type": "application/pdf",
            "X-File-Name": "CO Submission.pdf",
          },
          data: { blob },
        }).then(response => {
          res.status(200).json(
            //for preventing Timeout
            { result: response }
          );
        });

        // const file = fs.readFileSync("./public/Subcontractor's Proposal.pdf");
        // const blob = Buffer.from(file);
        // await axios({
        //   method: "post",
        //   url: `https://www.wrike.com/api/v4/tasks/${query.taskid}/attachments`,
        //   timeout: 15000, // 5 seconds timeout
        //   headers: {
        //     Authorization:
        //       "bearer eyJ0dCI6InAiLCJhbGciOiJIUzI1NiIsInR2IjoiMSJ9.eyJkIjoie1wiYVwiOjIxMjg5MzIsXCJpXCI6NjYyMzk5NixcImNcIjo0NTkzODAxLFwidVwiOjQyODM2NzEsXCJyXCI6XCJVU1wiLFwic1wiOltcIldcIixcIkZcIixcIklcIixcIlVcIixcIktcIixcIkNcIixcIkFcIixcIkxcIl0sXCJ6XCI6W10sXCJ0XCI6MH0iLCJpYXQiOjE1NzA0NTc4NDR9.ayTohiITZBNn5f2axYfdDwUEsXC-WSlMFocdijGI0ic",
        //     // "Content-Type": "application/x-binary",
        //     "Content-Type": "application/pdf",
        //     "X-File-Name": "Subcontractor's Proposal.pdf",
        //   },
        //   data: { blob },
        // }).then(response => {
        //   res.status(200).json(
        //     //for preventing Timeout
        //     { result: response }
        //   );
        // });
        // const response = await fetch(
        //   `https://www.wrike.com/api/v4/tasks/${req.query.taskid}`,
        //   {
        //     method: "get",
        //     headers: {
        //       Authorization:
        //         "bearer eyJ0dCI6InAiLCJhbGciOiJIUzI1NiIsInR2IjoiMSJ9.eyJkIjoie1wiYVwiOjIxMjg5MzIsXCJpXCI6NjYyMzk5NixcImNcIjo0NTkzODAxLFwidVwiOjQyODM2NzEsXCJyXCI6XCJVU1wiLFwic1wiOltcIldcIixcIkZcIixcIklcIixcIlVcIixcIktcIixcIkNcIixcIkFcIixcIkxcIl0sXCJ6XCI6W10sXCJ0XCI6MH0iLCJpYXQiOjE1NzA0NTc4NDR9.ayTohiITZBNn5f2axYfdDwUEsXC-WSlMFocdijGI0ic",
        //     },
        //   }
        // );
        // const data = await response.json();
        // console.log(data);
        // return data;

        // axios({
        //   method: "get",
        //   url: `https://www.wrike.com/api/v4/tasks/${req.query.taskid}`,
        //   timeout: 5000, // 5 seconds timeout
        //   headers: {
        //     Authorization:
        //       "bearer eyJ0dCI6InAiLCJhbGciOiJIUzI1NiIsInR2IjoiMSJ9.eyJkIjoie1wiYVwiOjIxMjg5MzIsXCJpXCI6NjYyMzk5NixcImNcIjo0NTkzODAxLFwidVwiOjQyODM2NzEsXCJyXCI6XCJVU1wiLFwic1wiOltcIldcIixcIkZcIixcIklcIixcIlVcIixcIktcIixcIkNcIixcIkFcIixcIkxcIl0sXCJ6XCI6W10sXCJ0XCI6MH0iLCJpYXQiOjE1NzA0NTc4NDR9.ayTohiITZBNn5f2axYfdDwUEsXC-WSlMFocdijGI0ic",
        //   },
        //   body: {},
        // }).then(response => {
        //   console.log(response);
        //   res.status(200).json(
        //     //for preventing Timeout
        //     { result: response }
        //   );
        // });

        // pdf2base64("./assets/img/training/CO Submission.pdf")
        //   .then(async response1 => {
        //     let b64 = response1;
        //     await axios({
        //       method: "post",
        //       url: `https://www.wrike.com/api/v4/tasks/${query.taskid}/attachments`,
        //       timeout: 15000, // 5 seconds timeout
        //       headers: {
        //         Authorization:
        //           "bearer eyJ0dCI6InAiLCJhbGciOiJIUzI1NiIsInR2IjoiMSJ9.eyJkIjoie1wiYVwiOjIxMjg5MzIsXCJpXCI6NjYyMzk5NixcImNcIjo0NTkzODAxLFwidVwiOjQyODM2NzEsXCJyXCI6XCJVU1wiLFwic1wiOltcIldcIixcIkZcIixcIklcIixcIlVcIixcIktcIixcIkNcIixcIkFcIixcIkxcIl0sXCJ6XCI6W10sXCJ0XCI6MH0iLCJpYXQiOjE1NzA0NTc4NDR9.ayTohiITZBNn5f2axYfdDwUEsXC-WSlMFocdijGI0ic",
        //         "content-type": "application/pdf",
        //         "X-File-Name": "CO Submission.pdf",
        //         "Content-Transfer-Encoding": "base64",
        //       },
        //       data: { b64 },
        //     }).then(response2 => {
        //       res.status(200).json(
        //         //for preventing Timeout
        //         { result: response2 }
        //       );
        //     });
        //     //cGF0aC90by9maWxlLmpwZw==
        //   })
        //   .catch(error => {
        //     console.log(error); //Exepection error....
        //   });

        // fs.readFile(
        //   "./assets/img/training/CO Submission.pdf",
        //   function (err, data) {
        //     if (err) throw err;

        //     // Encode to base64
        //     var encodedImage = new Buffer(data, "binary").toString("base64");

        //     // Decode from base64
        //     var decodedImage = new Buffer(encodedImage, "base64").toString(
        //       "binary"
        //     );

        //     axios({
        //       method: "post",
        //       url: `https://www.wrike.com/api/v4/tasks/${query.taskid}/attachments`,
        //       timeout: 15000, // 5 seconds timeout
        //       headers: {
        //         Authorization:
        //           "bearer eyJ0dCI6InAiLCJhbGciOiJIUzI1NiIsInR2IjoiMSJ9.eyJkIjoie1wiYVwiOjIxMjg5MzIsXCJpXCI6NjYyMzk5NixcImNcIjo0NTkzODAxLFwidVwiOjQyODM2NzEsXCJyXCI6XCJVU1wiLFwic1wiOltcIldcIixcIkZcIixcIklcIixcIlVcIixcIktcIixcIkNcIixcIkFcIixcIkxcIl0sXCJ6XCI6W10sXCJ0XCI6MH0iLCJpYXQiOjE1NzA0NTc4NDR9.ayTohiITZBNn5f2axYfdDwUEsXC-WSlMFocdijGI0ic",
        //         "Content-Type": "application/pdf",
        //         "X-File-Name": "CO Submission.pdf",
        //       },
        //       data: { data },
        //     }).then(response2 => {
        //       res.status(200).json(
        //         //for preventing Timeout
        //         { result: response2 }
        //       );
        //     });
        //   }
        // );

        //cGF0aC90by9maWxlLmpwZw==

        break;

      default:
        res.setHeader("Allow", ["GET"]);
    }
  });
};

export default getFile;
