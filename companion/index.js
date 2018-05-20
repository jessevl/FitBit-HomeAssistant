import { me } from "companion";
import * as messaging from "messaging";
import { outbox } from "file-transfer"
import { settingsStorage } from "settings";
import { HassAPI } from "./hass.js";
import * as cbor from "cbor";



settingsStorage.onchange = function(evt) {
  sendStates();
}

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  // Ready to send or receive messages
  sendStates();
}

// Listen for the onmessage event
messaging.peerSocket.onmessage = function(evt) {
  // Output the message to the console
  console.log(JSON.stringify(evt.data));
}

function sendStates(){
  let hassUrl = JSON.parse(settingsStorage.getItem("HassUrl")).name;
  let hassPw = JSON.parse(settingsStorage.getItem("HassPw")).name;
  
  let hassApi = new HassAPI(hassUrl,hassPw);
  hassApi.currentStates().then(function (response) {

      // Queue the file for transfer
      outbox.enqueue("states.json", cbor.encode(response)).then(function (ft) {
        // Queued successfully
        console.log("Transfer of '" + "states.json" + "' successfully queued.");
      }).catch(function (error) {
        // Failed to queue
        throw new Error("Failed to queue '" + "states.json" + "'. Error: " + error);
      });
    }).catch(function (error) {
      // Log the error
      console.log("Failure: " + error);
    });
    
  
}