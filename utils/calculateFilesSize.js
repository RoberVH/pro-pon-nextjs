
export const calculateFilesSize=(files) => {
    let maxbytes = 0;
    Array.from(files).forEach((file) => {
      maxbytes += file.size;
    });
    return maxbytes
}