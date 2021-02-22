
// find a better way to manage this, now the script is executed when the 
// extension is installed
chrome.runtime.onInstalled.addListener(function() {
  console.log("Open all Tabs is being installed!");
});

function collectURLs(device){
  //get all the sessions, fill remoteDeviceURLs
  remoteDeviceURLs = [];
  device.sessions.forEach(function(sess){
    if(sess.tab){
      console.log(sess.tab.url);
    } else {  
      sess.window.tabs.forEach( tab =>remoteDeviceURLs.push(tab.url) );
    }
  });  
  return remoteDeviceURLs;       
}


function dumpDevices(devices, deviceAction) {
    $('#deviceinfos').empty();
    $('#deviceinfos').append(outputDevicesToList(devices));
    let deviceToSession = new Map();
    for (i = 0; i < devices.length; i++) {
      deviceToSession.set(devices[i].deviceName, collectURLs(devices[i]));
    }
    return deviceToSession;
}

function outputDevicesToList(devices) {
    var table = $('<table border="1">');
    table.append($("<tr>" +
                   "<th>" + "Name" + "</th>" +
                   "</tr>"));
    for (i = 0; i < devices.length; i++) {
        table.append($("<tr>" +
                       "<td><button class=\"foundDevices\">"+ devices[i].deviceName +"</a></td>" +
                       "</tr>"));
    }
    return table;
}

async function populateDevices(deviceAction){
  return new Promise(resolve => {
      let noDeviceFilter = {};
      chrome.sessions.getDevices(noDeviceFilter, devices => {
        let dTs = dumpDevices(devices, deviceAction); 
        resolve(dTs);
        });
    });
}


function prit(s){
  let m = "";
   for (key of s) {
        m += key;
    }
   alert(m); 
}

function openURLsInWindow(remoteURLs){
  chrome.windows.create({
        focused: true,
        type: "normal",
        url: remoteURLs,
      });
}

function makeDeviceTabActionListerner(devicesURLMap, actionOnURLs){
  return function() {
     alert(this.innerHTML);
     urls = devicesURLMap.get(this.innerHTML);
     actionOnURLs(urls); 
  }
}  

document.addEventListener('DOMContentLoaded', async function () {
    const devicesURLMap = await populateDevices(null);
    //let devicePrinterAction = makeDeviceTabActionListerner(devicesURLMap, prit);
    const deviceWindowAction = makeDeviceTabActionListerner(devicesURLMap, openURLsInWindow);
    $('.foundDevices').on("click", deviceWindowAction);
});
