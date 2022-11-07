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