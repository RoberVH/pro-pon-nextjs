// Several Utilities

// Time conversion

//Translate an Unix Epoch to string date on locale
export const convDate = (unixEpoch) => {
const milliseconds = unixEpoch * 1000 // 1575909015000
const dateObject = new Date(milliseconds)
console.log('unixepoch, dateobject', unixEpoch,dateObject.toLocaleString())
return dateObject.toLocaleString()
}

//Translate string date  to  Unix Epoch 
export const convUnixEpoch = (date) => {
    console.log('date', date)
    console.log('new Date(date)',new Date(date))
    const unixEpoch = Math.floor(new Date(date).getTime()/1000) 
    console.log('unixepoch:',unixEpoch)
    return unixEpoch
}