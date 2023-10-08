export const  readUserFile= () => {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "*"; 
      input.onchange = () => {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            status: true,
            content: reader.result,
            message: "",
            filename:file.name
          });
        };
        reader.onerror = () => {
          resolve({
            status: false,
            content: null,
            message: "Error_reading_file",
          });
        };
        reader.readAsArrayBuffer(file);
      };
      input.click();
    });
  }
  