const mailjet = require("node-mailjet").apiConnect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_API_SECRET
);
import { notifyRegistrationOpenRFPHTML, SubjetNotifRFP } from "../../utils/emailText";
import { validateEmails } from "../../utils/misc";





export default async function handler(req, res) {
  // Configuración del correo electrónico
  const {
    recipient,
    rfpname,
    rfpid,
    companyid,
    hostcompany,
    companyname,
    rfpDescriptor,
    lang,
    notiftype
  } = req.body;
 
  if (!validateEmails([recipient])) {
    res.status(403).json({ status: false, message: "invalid_email_format" });
    return;
  }


  //const baseUrl=`${process.env.NEXT_PUBLIC_PROPON_URL}/${lang}/`
  const baseUrl=`${process.env.NEXT_PUBLIC_VERCEL_URL}/${lang}/`
  const rfplink = `${baseUrl}homerfp?companyId=${encodeURIComponent(companyid)}&companyname=${encodeURIComponent(hostcompany)}&rfpidx=${rfpid}`

  const textHTML = notifyRegistrationOpenRFPHTML(rfpname, companyname, rfpDescriptor, lang, rfplink)
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
            Email: recipient,
            Name: companyname,
          },
        ],
        Subject: subjectLine,
        TextPart: "",
        HTMLPart: textHTML,
        CustomID: "PROPON.ME-Bidding",
      },
    ],
  };


  try {
    const request = await mailjet
      .post("send", { version: "v3.1" })
      .request(emailObj);

    res.status(201).json({ status: true, message: "ok" });
  } catch (err) {
    res.status(501).json({ status: false, message:  err.message });
  }
}
