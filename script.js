
// find a better way to manage this, now the script is executed when the 
// extension is installed
chrome.runtime.onInstalled.addListener(function() {
  console.log("Open all Tabs is being installed!");
});


chrome.browserAction.onClicked.addListener(function(tab) {
  allDevicesToLaptop();
});


function allDevicesToLaptop(){
    // Get all devices  
  chrome.sessions.getDevices({}, function(devices) {
    devices.forEach(function(aDevice){
      // device name
      console.log(aDevice.deviceName +", sessions #"+aDevice.sessions.length);
      remoteDeviceURLs = [];
      // for that device, get all the sessions, fill remoteDeviceURLs
      aDevice.sessions.forEach(function(sess){
        if(sess.tab){
          console.log(sess.tab.url);
        } else {  
          sess.window.tabs.forEach(function(tab){
            remoteDeviceURLs.push(tab.url);
          });
        }
        
      });

      // Open a new window on the laptop with all te tabs of the remote device, this preloads 
      // all the pages, can be slow! 
      chrome.windows.create({
        focused: true,
        type: "normal",
        url: remoteDeviceURLs,
      });
    });
  });
}

