export const serializeArray = (arr) => {
    const serialized = [];
    serialized.push(arr[0]); // Pushing the first string element as is
    for (let i = 1; i < arr.length; i++) {
      const element = arr[i];
      if (Array.isArray(element)) {
        serialized.push(element.join(', ')); // Convert array to string
      } else {
        serialized.push(element);
      }
    }
    return JSON.stringify(serialized);
  }
  
  export const  deserializeArray = (str) => {
    const deserialized = JSON.parse(str);
    const result = [];
    result.push(deserialized[0]); // Pushing the first string element as is
    for (let i = 1; i < deserialized.length; i++) {
      const element = deserialized[i];
      if (typeof element === 'string' && element.includes(',')) {
        result.push(element.split(', ')); // Convert string to array
      } else {
        result.push(element);
      }
    }
    return result;
  }
  