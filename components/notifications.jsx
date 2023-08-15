
/**
 * notifications
 *      Pops a modal form to add emails of 
 *        a) Companies not registered to Propon to invite them to register to Propon and sign up to an OPEN RFP
 *        b) Companies not registered to Propon to invite them to register to Propon for the issuer to be able to register them to an INVITATION RFP
 
 */

import { useState } from "react"
import Image from "next/image"

import { MailIcon } from "@heroicons/react/outline"
import { validateEmails} from  "../utils/misc"
import {invRFText, SubjetNotifRFP} from "../utils/emailText"
import "react-toastify/dist/ReactToastify.css"
import { toastStyle, toastStyleSuccess, toastStyleWarning } from "../styles/toastStyle"
import { toast } from "react-toastify"
import { nanoid } from "nanoid"

function Notifications({ t, rfpRecord, notiftype, lang }) {
  const [inputEmail, setInputEmail] = useState("")
  const [recipientList, setRecipientList] = useState([])

  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
  const inputclasses =
    "leading-normal flex-1 border-0  border-grey-light rounded rounded-l-none " &&
    "font-roboto  outline-none pl-10 w-full focus:bg-blue-100 bg-stone-100";

  /** UTILITY FUNCTIONS ********************************************************************** */
  const errToasterBox = (msj) => {
    toast.error(msj, toastStyle);
  };

  const addEmailtoList = (email) => {
    if (email.trim()==='') return
    if (emailPattern.test(email)) {
      setRecipientList([...recipientList, inputEmail]);
      setInputEmail("");
    } else {
        errToasterBox(t("emailerror", { ns: "gralerrors" }));
    }
  };

       
  /** HANDLERS FUNCTIONS ********************************************************************** */
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addEmailtoList(event.target.value);
    }
  };
  const handleRemoveRecipient = (recipient) => {
    setRecipientList(recipientList.filter((element) => recipient !== element));
  };

  const handleSendEmailPropon= async () => {
    const url = "/api/send-emails";
    const params= {
        recipients:recipientList, 
        rfpname:rfpRecord.description, 
        rfpid:rfpRecord.rfpIndex.toString(), 
        companyid: rfpRecord.companyId,
        rfpDescriptor: rfpRecord.name,
        hostcompany:rfpRecord.companyname, 
        lang:lang, 
        notiftype: notiftype
    }

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
        toast.success( ` ${recipientList.length} ${t("notif_sent_ok", { ns: "common" }, toastStyleSuccess)}` )
      } else {
        errToasterBox(t("emailerror", { ns: "gralerrors" }));
      }
    } catch(error) {
      errToasterBox(t("emailerror", { ns: "gralerrors" }));
    }
  };

  // create a notification email and open it on the user local email client
  const handlePrepareEmail= () => {
  if (!validateEmails(recipientList)) {
    errToasterBox(t('invalid_email_format',{ns:"gralerrors"}))
    return;
  }
  //const baseUrl=`${process.env.NEXT_PUBLIC_PROPON_URL}/${lang}/`
  const baseUrl=`${process.env.NEXT_PUBLIC_VERCEL_URL}/${lang}/`
  const rfplink = `${baseUrl}homerfp?companyId=${encodeURIComponent(rfpRecord.companyId)}&companyname=${encodeURIComponent(rfpRecord.companyname)}&rfpidx=${rfpRecord.rfpIndex}`
  const subjectLine = `${SubjetNotifRFP[lang][notiftype]} ${rfpRecord.name} - ${rfpRecord.description}`
  
  const textHTML = invRFText(
    rfpRecord.name,
    rfpRecord.companyname,
    rfpRecord.description,
    rfplink,
    lang,
    notiftype,
  )

  
    // Encode the HTML content properly
    //const encodedHTMLText = encodeURIComponent(textHTML);

  try {    // Create a hidden anchor tag and use it to 'click' the mailto link
    const link = document.createElement('a');
    link.href = `mailto:?bcc=${recipientList.join(',')}&subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(textHTML)}`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.warn(t("email_prepare_ok",{ns:"common"}, {...toastStyleWarning, closeOnClick:false, pauseOnHover: true, autoclose:10000, hideProgressBar: true}))
  } catch (error) {
    errToasterBox(error.message)
  }
  };


  /**** Inner components ***************************************************/
  function EmailInputCtl() {
    return (
      <div className="w-full overflow-hidden whitespace-nowrap border-2 border-orange-200 flex  bg-stone-100">
        <MailIcon className="absolute h-5 w-5 text-orange-400 mt-1 ml-2  justify-between " />
        <input
          className={inputclasses}
          value={inputEmail}
          onChange={(e) => setInputEmail(e.target.value)}
          placeholder={t("email", { ns: "companies" })}
          onKeyDown={handleKeyDown}
          type="email"
          title={t('input_email_tooltip', {ns:"common"})}
        />
        <div className="p-1">
          <p
            onClick={() => addEmailtoList(inputEmail)}
            className="ml-2 p-1 btn-add-circular pb-2 text-base cursor-pointer"
          >
            +
          </p>
        </div>
      </div>
    );
  }
  /** MAIN JSX ********************************************************************** */
  return (
    <div id="notification" className="mt-4 p-4">
      <div id="title-frm" className="flex items-center mx-4 ">
        <Image src="/email.svg" height={22} width={22} alt="warning" className="object-contain "/>
        <p className="text-stone-800    mt-2 ml-2 font-khula">
          {t("email_notif_formtitle", { ns: "common" })}
        </p>
      </div>
      <div id="content-recipient-frm" className=" p-4 mx-8 mt-6  space-x-4 rounded-md border-2 border-stone-400 min-h-[18rem]">
        <div id="input-holder" className="w-[70%] ">
          <div id="input-wrapper" className="flex items-center w-full">
            {EmailInputCtl()}
          </div>
        </div>
        <div id="box-area" className="flex items-center my-6 ">
          {Boolean(recipientList.length) ? (
            <div id="outer-list" className=" min-w-0 overflow-auto w-[34rem] max-h-[10rem] border-[1px] border-stone-500 rounded-md p-2 ">
              <div id="inner-list" className="flex items-center space-y-1 ">
                <ul className="w-[32rem]  flex flex-col space-y-2 ">
                  {recipientList.map((recipient) => (
                    <li
                      key={nanoid()}
                      className="flex  items-center justify-between bg-gray-200 rounded-md  "
                    >
                      <p className="text-stone-500 truncate  px-4 py-1 text-sm">
                        {recipient}
                      </p>
                      <div className="pr-1">
                        <p
                          onClick={() => handleRemoveRecipient(recipient)}
                          className="btn-removeall-circular mr-1"
                        >
                          <span className="scale-[80%]">
                            x
                          </span>
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p className="w-[55%]"></p>
          )}
          {Boolean(recipientList.length) && (
            <div id="buttons-area" className="flex flex-col space-y-4  mx-auto ml-2">
              <button onClick={handleSendEmailPropon} title={t('send_email_tooltip',{ns:"common"})} className="action-btn " >
                {t("send_email", {ns:"common"})}
              </button>
              <button onClick={handlePrepareEmail} title={t("prepare_email_tooltip", {ns:"common"})} className="action-btn">
                {t("send_own_email", {ns:"common"})}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifications;
