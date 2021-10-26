const emailConfig = require("../../../emailConfig.js");

const emailHandler = (req, res) => {
  const { method, body } = req;
  return new Promise(resolve => {
    switch (method) {
      case "POST":
        var nodeoutlook = require("nodejs-nodemailer-outlook");

        nodeoutlook.sendEmail({
          auth: {
            user: emailConfig.emailConfig.user,
            pass: emailConfig.emailConfig.password,
          },
          from: "dtrump.owner@exbon.com",
          // from: "twall.subcontractor@exbon.com",
          to: body.username + "@exbon.com",
          subject: "Layout conflict",
          html: `<p>Exbon,</p>
           <p>Please see attached RFI response for your action. Field Instruction will follow in separate email. </p>
           <p>Thank you</p>
           <br/>
           <strong>Don Trump, OAR</strong>`,
          // text: "This is text version!",
          // replyTo: "receiverXXX@gmail.com",
          attachments: [
            {
              filename: "RFI#05 Light Obstruction UNIV Response.pdf",
              path: "./assets/img/training/RFI#05 Light Obstruction UNIV Response.pdf",
              contentType: "application/pdf",
            },
          ],
          onError: e => console.log(e),
          onSuccess: i => {
            console.log(i);
            res.status(200).json({
              //for preventing Timeout
              result: 1,
            });
            resolve();
          },
        });
        return resolve();

        break;

      default:
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        res.status(404).end(`Failed`);
        resolve();
    }
  });
};

export default emailHandler;
