export function HassAPI(HassUrl,HassPw) {
  if ((HassUrl !== undefined) && (HassPw !== undefined)) {
    this.hassUrl = HassUrl;
    this.hassPw = HassPw;
  }
  else {
    console.log("No url & PW in settings");
  }
};

HassAPI.prototype.currentStates = function(){
  let self = this;
  
  return new Promise(function(resolve,reject){
    let url = self.hassUrl;
    url += "/api/states";
    url += "?api_password="+self.hassPw;

    fetch(url).then(function(response){
      return response.json();
    }).then(function(json){
      
      let groups = [];
      let lights = {"name":"Lights", "devices":[]};
      
      json.forEach((entity)=>{
        if ((entity.entity_id.includes("group.") == true) 
            && (entity.attributes.hidden != true)
            && (entity.attributes.friendly_name.length > 1)) {
              let g = {
                "name": entity["attributes"]["friendly_name"],
                "devices": []
              }

              entity["attributes"]["entity_id"].forEach((sub_entity)=>{
                try {
                    let sub_entityObject = json.find((el)=>{
                    return el.entity_id === sub_entity;
                  });
                  
                  if (sub_entityObject
                     && (sub_entityObject.attributes.hidden != true)){
                    let d = {
                    "name":sub_entityObject["attributes"]["friendly_name"],
                    "state":sub_entityObject["state"],
                    "unit":sub_entityObject["attributes"]["unit_of_measurement"],
                    "entity_id":sub_entity
                    }
                    
                    g.devices.push(d);
                  }            

                } catch(e) {
                  console.log(e+sub_entity); 
                }
              });
              groups.push(g)  
          
        } else if (entity.attributes.is_hue_group == true){
          let l = {
            "name": entity["attributes"]["friendly_name"],
            "entity_id": entity["entity_id"],
            "state": entity["state"]
          }
          lights.devices.push(l);
        }
      });
      
      let timestamp = new Date(); 
      
      groups.push(lights);
      
      let response = {
        Groups: groups,
        timeStamp: timestamp
      }
      
      resolve (response);
      
    }).catch(function (error) {
      reject(error);
    });
  })
} 
