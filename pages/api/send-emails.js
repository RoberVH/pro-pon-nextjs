/**
 *  api/send-emails
*     Constructs email based on templates accordig to type of notification passed on parameters (calls method invRFPHTML)
*    Send notifications email to all emails sent in the recipients param
 */

const mailjet = require("node-mailjet").apiConnect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_API_SECRET
);
import { invRFPHTML, SubjetNotifRFP } from "../../utils/emailText";
import { validateEmails } from "../../utils/misc";





export default async function handler(req, res) {
  // Configuración del correo electrónico
  const {
    recipients,
    rfpDescriptor,
    companyid,
    rfpname,
    rfpid,
    hostcompany,
    lang,
    notiftype,
  } = req.body;
 
  if (!validateEmails(recipients)) {
    res.status(403).json({ status: false, message: "invalid_email_format" });
    return;
  }


  const baseUrl=`${process.env.NEXT_PUBLIC_PROPON_URL}/${lang}/`
  //const baseUrl=`${process.env.NEXT_PUBLIC_VERCEL_URL}/${lang}/`
  const rfplink = `${baseUrl}homerfp?companyId=${encodeURIComponent(companyid)}&companyname=${encodeURIComponent(hostcompany)}&rfpidx=${rfpid}`

  const textHTML = invRFPHTML(
    rfpDescriptor,
    rfpname,
    hostcompany,
    rfplink,
    lang,
    notiftype
  );
  const subjectLine = `${SubjetNotifRFP[lang][notiftype]} ${rfpDescriptor} - ${rfpname}`


  const emailObj = {
    Messages: [
      {
        From: {
          Email: "no-reply@propon.me",
          Name: "Propon.me - RFPs",
        },
        To: [
          {
            Email: "noreply@propon.me",
            Name: "No Reply",
          },
        ],
        Subject: subjectLine,
        TextPart: "",
        HTMLPart: textHTML,
        CustomID: "PROPON.ME-Bidding",
      },
    ],
  };

  const bccRecipients = [];
  for (var i = 0; i < recipients.length; i++) {
    bccRecipients.push({
      Email: recipients[i],
      Name: "Propon.me Bidders",
    });
  }

  emailObj.Messages[0].Bcc = bccRecipients;

  try {
    const request = await mailjet
      .post("send", { version: "v3.1" })
      .request(emailObj);

    res.status(201).json({ status: true, message: "ok" });
  } catch (err) {
    res.status(501).json({ status: false, message: err.message });
  }
}
