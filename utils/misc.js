// Several Utilities

// Time conversion

//Translate an Unix Epoch to string date on locale

const convDate = (unixEpoch) => {

const milliseconds = unixEpoch * 1000 // 1575909015000
const dateObject = new Date(milliseconds)
console.log('unixepoch, dateobject', unixEpoch,dateObject.toLocaleString())
return dateObject.toLocaleString()

}