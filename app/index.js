import * as messaging from "messaging";
import { inbox } from "file-transfer";
import * as fs from "fs";
import * as cbor from "cbor";
import { HassUI } from "./ui.js";

let ui = new HassUI();

try {
  let message  = fs.readFileSync("/private/data/states.json","cbor");
  ui.updateUI("cached", message);
} catch(e){
  ui.updateUI("loading");
}


//ui.updateUI("disconnected");

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  
  messaging.peerSocket.send("Hi!");
}

// Listen for the onmessage event
messaging.peerSocket.onmessage = function(evt) {

}

inbox.onnewfile = function () {
  var fileName;
  do {
    // If there is a file, move it from staging into the application folder
    fileName = inbox.nextFile();
    if (fileName) {
      console.log("/private/data/" + fileName + " is now available");
    }
  } while (fileName);
  
  let message  = fs.readFileSync("/private/data/states.json","cbor");
  ui.updateUI("loaded", message);
};

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  ui.updateUI("error");
}