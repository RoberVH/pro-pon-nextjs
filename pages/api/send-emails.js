/**
 *  api/send-emails - Route to send automatic emails from propon email server
 *     Constructs email based on templates accordig to type of notification passed on parameters (calls method invRFPHTML)
 *    Send notifications email to all emails sent in the recipients param
 */

import { SubjectCharsLimit } from "../../utils/emailText"


const mailjet = require("node-mailjet").apiConnect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_API_SECRET
)
import {
  declarationRFPHTML,
  invRFPHTML,
  SubjetNotifRFP,
} from "../../utils/emailText"
import { validateEmails } from "../../utils/misc"

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
  } = req.body

  if (!validateEmails(recipients)) {
    res.status(403).json({ status: false, message: "invalid_email_format" })
    return
  }
  const baseUrl = `${process.env.NEXT_PUBLIC_PROPON_URL}/`
  const rfplink = `${baseUrl}homerfp?companyId=${encodeURIComponent(
    companyid
    )}&companyname=${encodeURIComponent(hostcompany)}&rfpidx=${rfpid}`
    

  let textHTML
  switch (notiftype) {
    case "notifRFPDeclared":
      // sent notification that an RFP is been declared
      textHTML = declarationRFPHTML(
        rfpname,
        hostcompany,
        rfpDescriptor,
        lang,
        rfplink
      )
      break
    default:
      // sent invitation to RFP
      textHTML = invRFPHTML(
        rfpDescriptor,
        rfpname,
        hostcompany,
        rfplink,
        lang,
        notiftype
      )
      break
  }

  // short Subject line if too long
  let subjectLine = `${SubjetNotifRFP[lang][notiftype]} ${rfpDescriptor} - ${rfpname}`
  if (subjectLine.length > SubjectCharsLimit) {
    subjectLine= `${subjectLine.slice(0, 252)}...`
  }

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
  }

  const bccRecipients = []
  for (var i = 0; i < recipients.length; i++) {
    bccRecipients.push({
      Email: recipients[i],
      Name: "Propon.me Bidders",
    })
  }

  emailObj.Messages[0].Bcc = bccRecipients

  try {
    const request = await mailjet
      .post("send", { version: "v3.1" })
      .request(emailObj)

    res.status(201).json({ status: true, message: "ok" })
  } catch (err) {
    res.status(501).json({ status: false, message: err.message })
  }
}
