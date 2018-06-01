import document from "document";

export function HassUI() {
  this.List = document.getElementById('my-tile-list');
  this.statusText = document.getElementById("status");
  this.statusPopup = document.getElementById("popup");
}

HassUI.prototype.updateUI = function(state, message) {
  if (state === "loaded") {
    this.List.style.display = "inline";
    this.statusText.text = "loaded";
    this.statusPopup.text = "";

    this.updateStateList(message);
  } else if (state === "cached"){
    this.List.style.display = "inline";
    this.statusText.text = "cached";
    this.statusPopup.text = "";

    this.updateStateList(message);
  }
  else {
    this.List.style.display = "none";

    if (state === "loading") {
      this.statusPopup.text = "Loading states ...";
    } else if (state === "disconnected") {
      this.statusPopup.text = "Please check connection to phone and Fitbit App"
    }
    else if (state === "error") {
      this.statusPopup.text = "Something terrible happened.";
    }
  }
}

HassUI.prototype.updateStateList = function(message) {
  
    let list = [];
    let groups = message.Groups;
  
    groups.forEach((group)=>{
      group.type = "group";
      list.push(group);
      
      group.devices.forEach((device)=>{
        device.type = "device";
        list.push(device);     
      })
    })  
 
    this.List.delegate = {
      getTileInfo : function(index) { 
        return { type : (list[index].type == "group") ? "group-pool":"device-pool",
                 name: list[index].name,
                 state: list[index].state,
                 unit: (list[index].unit == null) ? "":list[index].unit,
                 items: list[index].items,
                 index : index };
      },
      configureTile : function(tile, content) {
        if (content.type == 'group-pool') {
          tile.getElementById('title-text').text = content.name;
        } else if (content.type == 'device-pool') {
          tile.getElementById('title-text').text = content.name;
          tile.getElementById('state-text').text = content.state;
          tile.getElementById('state-unit').text= content.unit;
         
        }
      },
    };

    this.List.length = list.length;
}
