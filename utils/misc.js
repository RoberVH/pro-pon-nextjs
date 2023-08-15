// Several Utilities

//import { invRFPHTML, SubjetNotifRFP } from "../utils/emailText";

// Time conversion

//Translate an Unix Epoch to string date on locale
export const convDate = (unixEpoch) => {
  const milliseconds = unixEpoch * 1000; // 1575909015000
  const dateObject = new Date(milliseconds);
  return dateObject.toLocaleString();
};

//Translate string date  to  Unix Epoch
export const convUnixEpoch = (date) => {
  const unixEpoch = Math.floor(new Date(date).getTime() / 1000);
  return unixEpoch;
};

//return today in Unix Epoch
export const todayUnixEpoch = (date) => {
  const unixEpoch = Math.floor(new Date().getTime() / 1000);
  return unixEpoch;
};

// Check if object is empty
export const isEmpty = (obj) =>
  Reflect.ownKeys(obj).length === 0 && obj.constructor === Object;

// Send a warning to Serve to signal a malfunction
export const sendWarningServer = async (msgType, msg) => {
  try {
    const response = await fetch("/api/serverwarningsignaling", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ msgType: msgType, msg: msg }),
    });
    const resp = await response.json();
    return;
  } catch (error) {
    return;
  }
};

// select an Email Subject Line based on selector
// export const emailHTMLText = (
//   rfpDescriptor,
//   companyid,
//   rfpname,
//   rfpid,
//   hostcompany,
//   lang,
//   notiftype
// ) => {
//   let textHTML, subjectLine;
//   const rfplink = `https://www.propon.me/es/homerfp?companyId=${encodeURIComponent(
//     companyid
//   )}&companyname=${encodeURIComponent(hostcompany)}&rfpidx=${rfpid}`
//   console.log("emailHTMLText", notiftype);
//   switch (notiftype) {
//     case "notifnonRegCompanyOfInvRFP":
//     case "notifnonRegCompanyOfOpenRFP":
//       textHTML = invRFPHTML(
//         rfpDescriptor,
//         rfpid,
//         rfpname,
//         hostcompany,
//         rfplink,
//         lang,
//         notiftype
//       );
//       subjectLine = SubjetNotifRFP[lang][notiftype];
//       return { textHTML, subjectLine };
//       break;
//     case "notifRegCompanyOfOpenRFP":
//     case "notifInvitedCompanyToRFP":
//       textHTML = invRFPHTML(
//         rfpDescriptor,
//         rfpid,
//         rfpname,
//         hostcompany,
//         rfplink,
//         lang,
//         notiftype
//       );
//       subjectLine = SubjetNotifRFP[lang][notiftype];
//       return { textHTML, subjectLine };
//       break;
//     case "notifToRegisterToPropon":
//   }
// };

export const validateEmails = (emailArray) => {
  // Define the regular expression for basic email validation
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

  // Check every email in the array
  for (let email of emailArray) {
    if (!emailRegex.test(email)) {
      // If any email is invalid, return false
      return false;
    }
  }
  // If we made it through the loop without returning, then all emails are valid
  return true;
};

function parseEmailList(list) {
  return list.split(/[\s,;]+/).filter((email) => email);
}

export const sendToServerEmail = async (params) => {
  const url = "/api/send-emails";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
    const resp = await response.json();
    if (resp.status) {
      return { status: true, message: "notif_sent_ok" };
    } else {
      return { status: false, message: resp };
    }
  } catch (error) {
    return { status: false, message: error.message };
  }
};


export const sendToIssuerEmail = async (params) => {
  const url = "/api/send-emailissuer";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
    const resp = await response.json();
    if (resp.status) {
      return { status: true, message: "notif_sent_ok" };
    } else {
      return { status: false, message: resp };
    }
  } catch (error) {
    return { status: false, message: error.message };
  }
};
/*
       recipient: issuerCompany.email,
        rfpname: rfpRecord.description,
        rfpid: rfpRecord.rfpIndex.toString(),
        companyname: companyname,
        rfpDescriptor: rfpRecord.name,
        lang: lang,
        notiftype: typeOfNotification,
*/