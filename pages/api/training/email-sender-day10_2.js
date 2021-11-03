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
          from: "conti.subcontractor@exbon.com",
          // to: "hyunmyung.kim" + "@exbon.com",
          to: body.username + "@exbon.com",
          subject: "[Training] Signed Change Order",
          html: `<p>Exbon,</p>
           <p>Thank you for sending me a Change Order. Enclosed is a signed CO for your processing. </p>
           <p>Thank you</p>
           <br/>
           <strong>Conti Corporation</strong>`,
          // text: "This is text version!",
          // replyTo: "receiverXXX@gmail.com",
          attachments: [
            {
              filename: "Conti Corporation CO 1.pdf",
              path: "./assets/img/training/Conti Corporation CO 1.pdf",
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
