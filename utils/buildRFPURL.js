/**
 * buildRFPURL.js 
 *  Receive an RFP object, build and return the params url line
 */
 

export const buildRFPURL = (rfpObject) => {

    const urlItems= (items) => {
        if (items) return '&' + items.map(item => `items=${encodeURIComponent(item)}`).join('&')
            else return ''
    }
    
    const {items, ... postrfp} = rfpObject
    const rfpparams=Object.keys(postrfp).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(postrfp[key])}`).join('&')
    return (rfpparams + urlItems(items))
}