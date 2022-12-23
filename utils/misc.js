// Several Utilities

// Time conversion

//Translate an Unix Epoch to string date on locale
export const convDate = (unixEpoch) => {
const milliseconds = unixEpoch * 1000 // 1575909015000
const dateObject = new Date(milliseconds)
return dateObject.toLocaleString()
}

//Translate string date  to  Unix Epoch 
export const convUnixEpoch = (date) => {
    const unixEpoch = Math.floor(new Date(date).getTime()/1000) 
    return unixEpoch
}


// Check if object is empty
export const isEmpty = obj => Reflect.ownKeys(obj).length === 0 && obj.constructor === Object  

// Send a warning to Serve to signal a malfunction
export const sendWarningServer = async (msgType, msg) => {
    try {
        const response = await fetch("/api/serverwarningsignaling", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({msgType: msgType, msg: msg})
        });
        const resp = await response.json();
        console.log('Resp:', resp)
        return
    } catch (error) {
        console.log('Error sending warning message', error)
        return
    }
}