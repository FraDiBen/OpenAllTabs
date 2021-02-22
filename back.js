
// find a better way to manage this, now the script is executed when the 
// extension is installed
chrome.runtime.onInstalled.addListener(function() {
  console.log("Open all Tabs is being installed!");
});