
// Function to simulate script loading (replace with actual loading logic)
const simulateScriptLoading = (fileURL, delay) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const scriptEle = document.createElement("script");
      scriptEle.type = "text/javascript";
      scriptEle.async = true;
      scriptEle.src = fileURL;

      scriptEle.addEventListener("load", () => {
        resolve();
      });

      scriptEle.addEventListener("error", (error) => {
        reject(error);
      });

      document.body.appendChild(scriptEle);
    }, delay);
  });
};

// List of scripts to load (replace with actual script URLs and delays)
const scriptsToLoad = [
  { url: "js/socket.io.js" },
  { url: "js/main.js", delay: 1000 }
];

// Load all scripts and hide the loader when all scripts are loaded
Promise.all(
  scriptsToLoad.map((script) =>
    simulateScriptLoading(script.url, script.delay)
  )
)
  .catch((error) => {
    console.error("Error loading scripts:", error);
  });
