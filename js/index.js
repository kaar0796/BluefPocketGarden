// Based on an example:
//https://github.com/don/cordova-plugin-ble-central


// ASCII only
function bytesToString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
}

// ASCII only
function stringToBytes(string) {
    var array = new Uint8Array(string.length);
    for (var i = 0, l = string.length; i < l; i++) {
        array[i] = string.charCodeAt(i);
    }
    return array.buffer;
}

// this is ble hm-10 UART service
/*var blue= {
    serviceUUID: "0000FFE0-0000-1000-8000-00805F9B34FB",
    characteristicUUID: "0000FFE1-0000-1000-8000-00805F9B34FB"
};*/

//the bluefruit UART Service
var blue ={
	serviceUUID: '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
    txCharacteristic: '6e400002-b5a3-f393-e0a9-e50e24dcca9e', // transmit is from the phone's perspective
    rxCharacteristic: '6e400003-b5a3-f393-e0a9-e50e24dcca9e'  // receive is from the phone's perspective
}

var ConnDeviceId;
var deviceList =[];
 
function onLoad(){
	document.addEventListener('deviceready', onDeviceReady, false);
    bleDeviceList.addEventListener('touchstart', conn, false); // assume not scrolling
}

function onDeviceReady(){
	refreshDeviceList();
}

	 
function refreshDeviceList(){
	//deviceList =[];
	document.getElementById("bleDeviceList").innerHTML = ''; // empties the list
	if (cordova.platformId === 'android') { // Android filtering is broken
		ble.scan([], 5, onDiscoverDevice, onError);
	} else {
		//alert("Disconnected");
		ble.scan([blue.serviceUUID], 5, onDiscoverDevice, onError);
	}
}


function onDiscoverDevice(device){
	//Make a list in html and show devises
	var listItem = document.createElement('li'),
    html = device.name+ "," + device.id;
    listItem.innerHTML = html;
    document.getElementById("bleDeviceList").appendChild(listItem);
}


function conn(){
	
	//var  deviceTouch= event.srcElement.innerHTML;
	var  deviceTouch= "GREENHOUSE,D9:E3:F8:B6:B1:86"
	document.getElementById("debugDiv").innerHTML =""; // empty debugDiv
	var deviceTouchArr = deviceTouch.split(",");
	ConnDeviceId = deviceTouchArr[1];
	//for debug:
	document.getElementById("debugDiv").innerHTML += "<br>"+deviceTouchArr[0]+"<br>"+deviceTouchArr[1];
	ble.connect(ConnDeviceId, onConnect, onConnError);
 }
 
function onConnect(){
	document.getElementById("statusDiv").innerHTML = " Status: Connected";
	document.getElementById("bleId").innerHTML = ConnDeviceId;
	ble.startNotification(ConnDeviceId, blue.serviceUUID, blue.rxCharacteristic, onData, onError);
	 // ble.startNotification(deviceId, bluefruit.serviceUUID, bluefruit.rxCharacteristic, app.onData, app.onError);
}

function onConnError(){
	alert("Problem connecting");
	document.getElementById("statusDiv").innerHTML = " Status: Disonnected";
}

 function onData(data){ // data received from Arduino
	document.getElementById("receiveDiv").innerHTML = bytesToString(data);
}

function data(txt){
	messageInput.value = txt;
}	

function sendData() { // send data to Arduino
	 var data = stringToBytes(messageInput.value);
	ble.writeWithoutResponse(ConnDeviceId, blue.serviceUUID, blue.txCharacteristic, data, onSend, onError);
}
	
function onSend(){
	document.getElementById("sendDiv").innerHTML = "Sent: " + messageInput.value + "<br/>";
}

function disconnect() {
	ble.disconnect(deviceId, onDisconnect, onError);
}

function onDisconnect(){
	document.getElementById("statusDiv").innerHTML = "Status: Disconnected";
}
function onError(reason)  {
	alert("ERROR: " + reason); // real apps should use notification.alert
}
function myGarden(){
	if(document.getElementById('tomato').checked) {
		updateS(13, 8, "WET");
	}
	else if(document.getElementById('pepper').checked) {
		updateS(16, 8, "WET");
	}
	else if(document.getElementById('cabbage').checked) {
		updateS(15, 6, "SOAKED");
	}
	
}
function updateS(temp, light, moist)
{
	/*DEAFULT VALUES - DONT CHANGE*/
	var p1moist = document.getElementById("receiveDiv").innerHTML;
	var p1temp = 13;
	var p1light = 8;
	if(moist != p1moist) // Check if moist sensor information is different that the default values
	{
		document.getElementById("moistinfo").innerHTML = "Moisture is "+moist+" and it should be "+p1moist; // If not ok, shows which changes need to be done.
	}
	else
	{
		document.getElementById("moistinfo").innerHTML = "Moisture is OK"; // OK MESSAGE
		moistok=1; // moist is OK, setting value to the final message
	}
	if(temp != p1temp) // Check if temperature sensor information is different that the default values
	{
		document.getElementById("tempinfo").innerHTML = "Temperature is "+temp+" and it should be "+p1temp; // If not ok, shows which changes need to be done.
	}
	else
	{
		document.getElementById("tempinfo").innerHTML = "Temperature is OK"; // OK MESSAGE
		tempok=1; // temperature is OK, setting value to the final message
	}
	if(light != p1light) // Check if light sensor information is different that the default values
	{
		document.getElementById("lightinfo").innerHTML = "Light is "+light+" and it should be "+p1light; // If not ok, shows which changes need to be done.
	}
	else
	{
		document.getElementById("lightinfo").innerHTML = "Light is OK"; // OK MESSAGE
		lightok=1; // light is OK, setting value to the final message
	}
	
}