/**
 * @typedef ReadFromXdot
 * @param {req} Request object created by the ClearBlade Platform
 * @returns {resp} Response object created by the ClearBlade Platform
 * 
 * ReadFromXdot is a ClearBlade Platform code service that publishes a
 * message to a MQTT topic ({topic_root}/receive/request) in order to 
 * initiate a "read" from the serial port (LoRa radio) on the xDot device.
 * The xDotAdapter will publish responses to the {topic_root}/receive/response
 * MQTT topic.
 */
function ReadFromXdot(req, resp) {
  ClearBlade.init({request:req});
        
  //Get adapter config
  var query = ClearBlade.Query({collectionName:"adapter_config"});
  query.columns(["adapter_name", "topic_root"]);
  query.equalTo("adapter_name", "xDotSerialPortAdapter");
    
  query.fetch(function(err, data){
    if (err) {
      log(JSON.stringify(err));
      log(JSON.stringify(data));
            
      response.error(JSON.stringify(data));
    }

	  log(JSON.stringify(data));
		if(data.DATA.length > 0) {
	    //Publish "read" message to broker
      var msg = ClearBlade.Messaging();
            
      log("Publishing message to topic " + data.DATA[0].topic_root + "/receive/request");
      msg.publish(data.DATA[0].topic_root + "/receive/request","");
        
		  resp.success("Message published to topic " + data.DATA[0].topic_root + "/receive/request");
		}
		resp.error("No row returned from adapter_config collection");
	});
}