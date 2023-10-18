/**********************  email constants definitions and templates for email notifications ********************************** */

export const notifTypes = {
    notif_InvitedCompanyRFP: "notifInvitedCompanyToRFP", // (Automatic) A company was registered by the Issuer for an RFP, automatically sent to the already registered to Propon companies invitation and link to RFP
    notif_RegCompanyOpenRFP: "notifRegCompanyOfOpenRFP", // (Automatic) An Issuer company notify a  registered Company of an open RFP
    notif_noRegCompanyInvRFP: "notifnonRegCompanyOfInvRFP", // (Manual) An Issuer company notify a non registered Company of an Invitation RFP
    notif_noRegCompanyOpenRFP: "notifnonRegCompanyOfOpenRFP", // (Manual) An Issuer company notify a non registered candidate Company of an open RFP
    notif_ToRegPropon: "notifToRegisterToPropon", // A notification to a company to invite them to register to Propon
    notif_ToIssuerOpenRFP:"notifToIssuerOpenRFPcompanyRegstred", // A notification to an Issuer of an Open RFP that a company has registered to it
    notifDocumentUploaded: "notifDocumentUploaded", // A notification to all participants/Issuer that  documents have been uploaded
    notif_RFPDeclared: "notifRFPDeclared"
  };
  
  export const SubjetNotifRFP = {
    es: {
      notifInvitedCompanyToRFP: "Invitación Exclusiva: presenta tu propuesta para la Licitación ",
      notifRegCompanyOfOpenRFP: "Nueva Oportunidad: participa en la licitación abierta ",
      notifnonRegCompanyOfInvRFP: "Únete a Propon.me y participa en la Licitación por Invitación ",
      notifnonRegCompanyOfOpenRFP: "Invitación a licitación abierta: Regístrate en Propon.me y presenta tu propuesta para ",
      notifToIssuerOpenRFPcompanyRegstred:"Tienes un nuevo participante en tu Licitatión abierta ",
      notifToRegisterToPropon: "Transforma tus Licitaciones con Propon.me: ¡Regístrate Hoy!",
      notifRFPDeclared:"Este RFP en el que participas ha sido declarado: "
    },
    en: {
        notifInvitedCompanyToRFP: "Exclusive Invitation: submit your proposal for the Tender ",
        notifRegCompanyOfOpenRFP: "New Opportunity: participate in the open tender ",
        notifnonRegCompanyOfInvRFP: "Join Propon.me and participate in the Invitation-only Tender ",
        notifnonRegCompanyOfOpenRFP: "Invitation to open tender: Register on Propon.me and submit your proposal for ",
        notifToIssuerOpenRFPcompanyRegstred: "You have a new participant in your Tender ",
        notifToRegisterToPropon: "Transform your Tenders with Propon.me: Register Today!",
        notifRFPDeclared:"This RFP in which you participate has been declared: "
    },
    fr: {
        notifInvitedCompanyToRFP: "Invitation Exclusive : présentez votre proposition pour l'Appel d'offres ",
        notifRegCompanyOfOpenRFP: "Nouvelle Opportunité : participez à l'appel d'offres ouvert ",
        notifnonRegCompanyOfInvRFP: "Rejoignez Propon.me et participez à l'Appel d'offres sur Invitation ",
        notifnonRegCompanyOfOpenRFP: "Invitation à l'appel d'offres ouvert : Inscrivez-vous sur Propon.me et présentez votre proposition pour ",
        notifToIssuerOpenRFPcompanyRegstred: "Vous avez un nouveau participant à votre Appel d'offres ",
        notifToRegisterToPropon: "Transformez vos Appels d'offres avec Propon.me : Inscrivez-vous Aujourd'hui !",
        notifRFPDeclared : "L'appel d'offres auquel vous participez a été déclaré: "
    },
  };
  
  const headerHTML = `<div style=\"text-align: center; height: 3em;\">  
      <span style="font-size: 1.5em; display: inline-block; font-weight: bold; color: #269ce0;">Propon</span> 
      <span style="font-size: 1.5em; display: inline-block; font-weight: bold; color: #e27e27;">.me </span></div>`;
  
  // Invitation to register to Propon html text. 
  // Pending: update link to registering to Propontutorials / help 
  export const invitationToRegisterToProponHTMLes = `Para participar es necesario que registres tu compañía en <a href="https://propon.me">Propon.me</a> <br>
  Propon.me es una aplicación en la Blockchain que permite coordinar con plena seguridad y transparencia concursos de Propuestas de RFPs/Licitaciones.
  <br>
  Para registrarte primero es preciso contar con una billetera de Blockchain. Si no cuentas con una tu cuenta, el acceso será en modo sólo lectura. Revisa el RFP, registrate y asegúrate de 
  participar para empezar a dejar tu huella en la Blockchain. <br><br>
  Encuentra tutoriales e información sobre como registrarte en la siguiente liga: <a href="https://propon.me">Ayuda para registrarse a Propon.me</a><br>
  Creemos que Propon.me tiene el potencial de cambiar el mundo al permitir a las empresas y personas coordinar transparentemente sus procesos licitatorios y sus RFPs. <br><br>`

  export const invitationToRegisterToProponHTMLen = `To participate, you must register your company on <a href="https://propon.me">Propon.me</a> <br>
  Propon.me is a Blockchain application that allows coordinating RFP/Procurement proposal contests with full security and transparency.
  <br>
  To register, you must first have a Blockchain wallet. If you don't have an account, access will be read-only. Review the RFP, register, and make sure to
  participate to start leaving your mark on the Blockchain. <br><br>
  Find tutorials and information on how to register at the following link: <a href="https://propon.me">Help to register at Propon.me</a><br>
  We believe that Propon.me has the potential to change the world by allowing businesses and individuals to transparently coordinate their procurement processes and RFPs. <br><br>`

  export const invitationToRegisterToProponHTMLfr = `Pour participer, vous devez enregistrer votre entreprise sur <a href="https://propon.me">Propon.me</a> <br>
  Propon.me est une application Blockchain qui permet de coordonner les concours de propositions de RFP/Appels d'offres en toute sécurité et transparence.
  <br>
  Pour vous inscrire, vous devez d'abord avoir un portefeuille Blockchain. Si vous n'avez pas de compte, l'accès sera en mode lecture seule. Consultez le RFP, inscrivez-vous et assurez-vous de
  participer pour commencer à laisser votre empreinte sur la Blockchain. <br><br>
  Trouvez des tutoriels et des informations sur comment vous inscrire sur le lien suivant: <a href="https://propon.me">Aide pour s'inscrire à Propon.me</a><br>
  Nous croyons que Propon.me a le potentiel de changer le monde en permettant aux entreprises et aux individus de coordonner transparentement leurs processus d'appel d'offres et leurs RFP. <br><br>`

  export const invitationToRegisterToProponTextes = `Para participar es necesario que registres tu compañía en https://propon.me
  Propon.me es una aplicación en la Blockchain que permite coordinar con plena seguridad y transparencia concursos de Propuestas de RFPs/Licitaciones.
  
  Para registrarte primero es preciso contar con una billetera de Blockchain. Si no cuentas con una tu cuenta, el acceso será en modo sólo lectura. Revisa el RFP, registrate y asegúrate de 
  participar para empezar a dejar tu huella en la Blockchain. 
  
  Encuentra tutoriales e información sobre como registrarte en la siguiente liga: https://propon.me
  Creemos que Propon.me tiene el potencial de cambiar el mundo al permitir a las empresas y personas coordinar transparentemente sus procesos licitatorios y sus RFPs.`
  
  export const invitationToRegisterToProponTexten = `To participate, you must register your company on https://propon.me
  Propon.me is a Blockchain application that allows coordinating RFP/Procurement proposal contests with full security and transparency.
  
  To register, you must first have a Blockchain wallet. If you don't have an account, access will be read-only. Review the RFP, register, and make sure to
  participate to start leaving your mark on the Blockchain.
  
  Find tutorials and information on how to register at the following link: https://propon.me
  We believe that Propon.me has the potential to change the world by allowing businesses and individuals to transparently coordinate their procurement processes and RFPs.`

  export const invitationToRegisterToProponTextfr = `Pour participer, vous devez enregistrer votre entreprise sur https://propon.me
  Propon.me est une application Blockchain qui permet de coordonner les concours de propositions de RFP/Appels d'offres en toute sécurité et transparence.
  
  Pour vous inscrire, vous devez d'abord avoir un portefeuille Blockchain. Si vous n'avez pas de compte, l'accès sera en mode lecture seule. Consultez le RFP, inscrivez-vous et assurez-vous de
  participer pour commencer à laisser votre empreinte sur la Blockchain.
  
  Trouvez des tutoriels et des informations sur comment vous inscrire sur le lien suivant: https://propon.me
  Nous croyons que Propon.me a le potentiel de changer le monde en permettant aux entreprises et aux individus de coordonner transparentement leurs processus d'appel d'offres et leurs RFP.`
   
  export const invRFPHTML = (
    rfpDescriptor,
    RFPName,
    hostCompany,
    RFPLink,
    lang,
    notificationType,
  ) => {
    switch (lang) {
    case "es":
        return `${headerHTML}
        <br><br>
        <p style="text-align: left; margin-top: 2rem; font-weight: normal;">
        <strong>¡Hola!</strong>,
        <br><br>
        Tienes una invitación para participar en el RFP/Licitación <strong>"${rfpDescriptor} - ${RFPName}" </strong> de la compañía: <strong>${hostCompany}</strong> en <strong>Propon.me</strong><br> 
        Consulta el sitio del RFP: <a href="${RFPLink}">Sitio del RFP: ${rfpDescriptor} - ${RFPName}</a> <br><br>
        ${
          notificationType === "notifnonRegCompanyOfOpenRFP" ||
          notificationType === "notifnonRegCompanyOfInvRFP"
            ? invitationToRegisterToProponHTMLes
            : ""
        }
        ${
          notificationType === "notifnonRegCompanyOfInvRFP"
            ? `Una vez registrado, informa a <strong>${hostCompany}</strong> que ya tienes una cuenta en Propon.me, para que te agregue al registro de Blockchain como participante invitado del RFP <br>`
            : ""
        }
        Para presentar tu propuesta, deberás consultar el sitio web del RFP en el <a href=${RFPLink}>Sitio del RFP: ${rfpDescriptor} - ${RFPName}</a>   
        ${
          notificationType === "notifnonRegCompanyOfOpenRFP"
            ? ", regístrarte en la pestaña REGISTRAR PARTICIPANTE"
            : ""
        } 
        y participar cargando tus archivos en la pestaña ARCHIVOS DE PARTICIPANTES. <br>
        <br><br>
        ¡Esperamos tus propuestas!
        </p>
        <br>
        <p>
        <strong>**** Por favor no responda a este correo, esta es una cuenta no atendida y se usa sólo para enviar correos, no para recibirlos ****</strong></p>`;
        break;
    case "en":
        return `${headerHTML}
        <br><br>
        <p style="text-align: left; margin-top: 2rem; font-weight: normal;">
        <strong>Hello!</strong>,
        <br><br>
        You have an invitation to participate in the RFP/Tender <strong>"${rfpDescriptor} - ${RFPName}" </strong> from the company: <strong>${hostCompany}</strong> on <strong>Propon.me</strong><br> 
        Check the RFP site <a href="${RFPLink}">RFP Site: ${rfpDescriptor} - ${RFPName}</a> <br><br>
        ${
            notificationType === "notifnonRegCompanyOfOpenRFP" ||
            notificationType === "notifnonRegCompanyOfInvRFP"
            ? invitationToRegisterToProponHTMLen
            : ""
        }
        ${
            notificationType === "notifnonRegCompanyOfInvRFP"
            ? `Once registered, inform <strong>${hostCompany}</strong> that you have an account on Propon.me, so they can add you to the Blockchain registry as an invited participant of the RFP <br>`
            : ""
        }
        To submit your proposal, you must consult the RFP website at the <a href=${RFPLink}>RFP Site: ${rfpDescriptor} - ${RFPName}</a>   
        ${
            notificationType === "notifnonRegCompanyOfOpenRFP"
            ? ", register on the REGISTER BIDDERS tab"
            : ""
        } 
        and participate by uploading your files in the BIDDERS FILES tab. <br>
        <br><br>
        We look forward to your proposals!
        </p>
        <br>
        <p>
        <strong>**** Please do not reply to this email, this is an unattended account and is used only to send emails, not to receive them ****</strong>`;
        break;
    case "fr":
        return `${headerHTML}
        <br><br>
        <p style="text-align: left; margin-top: 2rem; font-weight: normal;">
        <strong>Bonjour !</strong>,
        <br><br>
        Vous avez une invitation à participer à l'RFP/Appel d'offres <strong>"${rfpDescriptor} - ${RFPName}" </strong> de la société : <strong>${hostCompany}</strong> sur <strong>Propon.me</strong><br> 
        Consultez le site de l'RFP <a href="${RFPLink}">Site de l'RFP: ${rfpDescriptor} - ${RFPName}</a> <br><br>
        ${
            notificationType === "notifnonRegCompanyOfOpenRFP" ||
            notificationType === "notifnonRegCompanyOfInvRFP"
            ? invitationToRegisterToProponHTMLfr
            : ""
        }
        ${
            notificationType === "notifnonRegCompanyOfInvRFP"
            ? `Une fois inscrit, informez <strong>${hostCompany}</strong> que vous avez un compte sur Propon.me, afin qu'ils vous ajoutent au registre Blockchain en tant que participant invité de l'RFP <br>`
            : ""
        }
        Pour soumettre votre proposition, vous devez consulter le site web de l'RFP sur le <a href=${RFPLink}>Site de l'RFP: ${rfpDescriptor} - ${RFPName}</a>   
        ${
            notificationType === "notifnonRegCompanyOfOpenRFP"
            ? ", vous inscrire dans l'onglet INSCRIRE UN ENCHERISSEUR"
            : ""
        } 
        et participer en téléchargeant vos fichiers dans l'onglet FICHIERS DES SOUMISIONNAIRES. <br>
        <br><br>
        Nous attendons vos propositions !
        </p>
        <br>
        <p>
        <strong>**** Veuillez ne pas répondre à cet e-mail, il s'agit d'un compte non surveillé et il est utilisé uniquement pour envoyer des e-mails, pas pour les recevoir ****</strong></p>`;
        break;
    }
  }
  
  export const invRFText = (
    rfpDescriptor,
    hostCompany,
    RFPName,
    RFPLink,
    lang,
    notificationType,
  ) => {
    switch (lang) {
    case "es":
        return `
        ¡Hola!,

        Tienes una invitación para participar en el RFP/Licitación ${rfpDescriptor} - ${RFPName} de la compañía: ${hostCompany} en https://Propon.me
        Puedes hallar sitio del RFP en: ${RFPLink}

        ${
            notificationType === "notifnonRegCompanyOfOpenRFP" ||
            notificationType === "notifnonRegCompanyOfInvRFP"
            ? invitationToRegisterToProponTextes
            : ""
        }
        ${
            notificationType === "notifnonRegCompanyOfInvRFP" || 
            notificationType === "notifnonRegCompanyOfOpenRFP"
            ? `Una vez registrado, informa a ${hostCompany} que ya tienes una cuenta en Propon.me, para que te agregue al registro de Blockchain como participante invitado del RFP`
            : ""
        }

        Para presentar tu propuesta, consulta el sitio web del RFP en el Sitio del RFP: ${RFPLink}

        ${
            notificationType === "notifnonRegCompanyOfOpenRFP"
            ? "Regístrate en la pestaña REGISTRAR PARTICIPANTE"
            : ""
        } 

        Participa cargando tus archivos en la pestaña ARCHIVOS DE PARTICIPANTES. 

        ¡Esperamos tus propuestas!`
        break;
    case "en":
        return `
        Hello!,

        You have an invitation to participate in the RFP/Tender ${rfpDescriptor} - ${RFPName} from the company: ${hostCompany} on https://Propon.me
        You can find the RFP site at: ${RFPLink}

        ${
            notificationType === "notifnonRegCompanyOfOpenRFP" ||
            notificationType === "notifnonRegCompanyOfInvRFP"
            ? invitationToRegisterToProponTexten
            : ""
        }
        ${
            notificationType === "notifnonRegCompanyOfInvRFP" || 
            notificationType === "notifnonRegCompanyOfOpenRFP"
            ? `Once registered, inform ${hostCompany} that you have an account on Propon.me, so they can add you to the Blockchain registry as an invited participant of the RFP`
            : ""
        }
        
        To submit your proposal, consult the RFP website at the RFP Site: ${RFPLink}

        ${
            notificationType === "notifnonRegCompanyOfOpenRFP"
            ? "Register on the REGISTER BIDDERS tab"
            : ""
        } 
        
        Participate by uploading your files in the BIDDERS FILES tab. 
        
        We look forward to your proposals!`
        break;
    case "fr":
        return `
        Bonjour !,

        Vous avez une invitation à participer à l'RFP/Appel d'offres ${rfpDescriptor} - ${RFPName} de la société : ${hostCompany} sur https://Propon.me
        Vous pouvez trouver le site de l'RFP à: ${RFPLink}

        ${
            notificationType === "notifnonRegCompanyOfOpenRFP" ||
            notificationType === "notifnonRegCompanyOfInvRFP"
            ? invitationToRegisterToProponTextfr
            : ""
        }
        ${
            notificationType === "notifnonRegCompanyOfInvRFP" || 
            notificationType === "notifnonRegCompanyOfOpenRFP"
            ? `Une fois inscrit, informez ${hostCompany} que vous avez un compte sur Propon.me, afin qu'ils vous ajoutent au registre Blockchain en tant que participant invité de l'RFP`
            : ""
        }
        
        Pour soumettre votre proposition, consultez le site web de l'RFP sur le Site de l'RFP: ${RFPLink}

        ${
            notificationType === "notifnonRegCompanyOfOpenRFP"
            ? "Inscrivez-vous dans l'onglet INSCRIRE UN ENCHERISSEUR"
            : ""
        } 
        
        Participez en téléchargeant vos fichiers dans l'onglet FICHIERS DES SOUMISIONNAIRES. 
        
        Nous attendons vos propositions !`
        break;
    
    }
  };
  
  export const InvitationToPropon = (hostCompany) => {
    switch (lang) {
      case "es":
        return `${headerHTML}
        <br><br>
        <p style="text-align: left; margin-top: 2rem; font-weight: normal;">
        <strong>¡Hola!</strong>,
        <br><br>
        Tienes una invitación para registrarte a Propon.me de la compañía: <strong>${hostCompany}</strong><br> 
        ${invitationToRegisterToProponHTMLes}
        No sólo podrás presentar propuestas a las licitationes de ${hostCompany}, sino también publicar tus propios concursos.
        <br><br>
        ¡Esperamos tu registro!
        </p>
        <br>
        <p>
        <strong>**** Por favor no responda a este correo, esta es una cuenta no atendida y se usa sólo para enviar correos, no para recibirlos ****</strong></p>`;
        break;
      case "en":
        break;
      case "fr":
        break;
    }
  };
  


  export const notifyRegistrationOpenRFPHTML = ( rfpname, companyname, rfpDescriptor, lang, RFPLink) => {
    switch (lang) {
      case "es":
        return `${headerHTML}
        <br><br>
        <p style="text-align: left; margin-top: 2rem; font-weight: normal;">
        <strong>¡Hola!</strong>,
        <br><br>
        La compañia <strong>${companyname}</strong> se ha registrado a tu concurso abierto <strong>${rfpDescriptor} - ${rfpname}</strong> en Propon.me<br> 
        <br><br>
        <a href="${RFPLink}">Sitio del RFP: ${rfpDescriptor} - ${rfpname}</a> 
        <br> <br> <br>
        <p><strong>**** Por favor no responda a este correo, esta es una cuenta no atendida y se usa sólo para enviar correos, no para recibirlos ****</strong></p>`;
        break;
      case "en":
        break;
      case "fr":
        break;
    }
  }

  export const declarationRFPHTML = ( rfpname, hostcompany, rfpDescriptor, lang, rfplink) => {
    switch (lang) {
      case "es":
        return `${headerHTML}
        <br><br>
        <p style="text-align: left; margin-top: 2rem; font-weight: normal;">
        <strong>¡Hola!</strong>,
        <br><br>
        El RFP <strong>${rfpDescriptor} - ${rfpname}</strong> de la compañía <strong>${hostcompany}</strong> ha sido declarado. Te invitamos a verificar el resultado<br> 
        <br><br>
        <a href="${rfplink}">Sitio del RFP: ${rfpDescriptor} - ${rfpname}</a> 
        <br> <br> <br>
        <p><strong>**** Por favor no responda a este correo, esta es una cuenta no atendida y se usa sólo para enviar correos, no para recibirlos ****</strong></p>`;
        break;
      case "en":
        return `${headerHTML}
        <br><br>
        <p style="text-align: left; margin-top: 2rem; font-weight: normal;">
        <strong>Hello!</strong>,
        <br><br>
        The RFP <strong>${rfpDescriptor} - ${rfpname}</strong> from the company <strong>${hostcompany}</strong> has been declared. You are invited to check the result<br> 
        <br><br>
        <a href="${rfplink}">RFP Site: ${rfpDescriptor} - ${rfpname}</a> 
        <br> <br> <br>
        <p><strong>**** Please do not reply to this email, this is an unattended account and is used only to send emails, not to receive them ****</strong></p>`;
        break;
      case "fr":
        return `${headerHTML}
        <br><br>
        <p style="text-align: left; margin-top: 2rem; font-weight: normal;">
        <strong>Bonjour !</strong>,
        <br><br>
        Le RFP <strong>${rfpDescriptor} - ${rfpname}</strong> de la société <strong>${hostcompany}</strong> a été déclaré. Vous êtes invité à vérifier le résultat<br> 
        <br><br>
        <a href="${rfplink}">Site du RFP : ${rfpDescriptor} - ${rfpname}</a> 
        <br> <br> <br>
        <p><strong>**** Veuillez ne pas répondre à cet email, il s'agit d'un compte non surveillé et est utilisé uniquement pour envoyer des emails, pas pour les recevoir ****</strong></p>`;
        break;

    }
  }