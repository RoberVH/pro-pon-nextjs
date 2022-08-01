
export const verifyData_Save = async (message, signature) => {

    let method = "POST";
    console.log('recibi en verifyData: message',message)
    console.log('recibi en verifyData: signature',signature)
    const webload= {signature:signature,...JSON.parse(message) }
    console.log('JSON webload',webload)

    //if (profileCompleted) method = "PATCH";
    try {
      const response = await fetch("/api/servercompanies", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(webload),
      });
      const resp = await response.json();

     // if (resp.status) toast.success(t("successsaving"), toastStyle);
      return;
    } catch (error) {
      console.log("Error del server:", error);
      errToasterBox(error, toastStyle);
    } finally {
      
    }
  };

