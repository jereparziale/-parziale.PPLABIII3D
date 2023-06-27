const URL = "http://localhost:3000/superheroes";


export const getSuperheroes = () => {
  return new Promise((resolve, reject) => { 
    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", () => {
      if (xhr.readyState == 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          const data = JSON.parse(xhr.responseText);
          resolve(data);
        } else {
          reject(new Error(`Error: ${xhr.status} - ${xhr.statusText}`));
        }
      }
    });

    xhr.open("GET", URL);
    xhr.send();
  });
};