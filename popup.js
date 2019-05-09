
/**
 * Popup.js
 * 
 * Display the information from getPagesSource.js:
 * 
 * Wordpress theme
 * Site ID
 * Conflicts
 * Mediavine scripts/code
 * Platform the website is using
 */

 //JSON to pass info to the plugin list popup
var infoJSON = {
  "name": "",
  "id": "",
  "theme": "",
  "platform": ""
}

//Listen for messages from getPagesSource
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  //display version number
  var fetchVersion = chrome.app.getDetails().version;
  var version = document.getElementById("version");
  version.innerText = "v" + fetchVersion;

  if (request.action == "getSource") {
    //Pull in scripts from getPagesSource.js
    var adArray = [];

    //Wrapper to append results to
    var wrapper = document.querySelector("#conflicts-wrapper");
    var scriptWrapper = document.querySelector("#scripts-wrapper");

    //Set wrapper for conflicts list
    for (var i = 0; i < request.source.fetchConflicts.length; i++) {
      adArray.push(request.source.fetchConflicts[i]);
      var para = document.createElement("p");

      if (adArray[i] == "//scripts.mediavine.com/tags") {
        
        scriptWrapper.style.display = "block";
        para.innerText = "mediavine";
        scriptWrapper.appendChild(para);
        displaySiteID();
      } else if (adArray[i] == "video.mediavine") {
        scriptWrapper.style.display = "block";
        para.innerText = "mediavine video";
        scriptWrapper.appendChild(para);
      } else if (adArray[i] == "chicoryapp") {
        scriptWrapper.style.display = "block";
        para.innerText = "non MV chicory";
        scriptWrapper.appendChild(para);
      } else {
        wrapper.style.display = "block";
        para.innerText = adArray[i];
        wrapper.appendChild(para);
      }
    }

    //Add Create to main wrapper
    if (request.source.fetchCreate.length > 0) {
      scriptWrapper.style.display = "block";
      var para = document.createElement("p");
      para.innerText = "mediavine create";
      scriptWrapper.appendChild(para);
    }

    //Add content hints to main wrapper
    if (request.source.fetchHints.length > 0) {
      wrapper.style.display = "block";
      var para = document.createElement("p");
      para.innerText = "content hints";
      wrapper.appendChild(para);
    }

    //Set cmp wrapper
    if (request.source.fetchCmp.length >= 0) {
      var cmpWrapper = document.getElementById("cmp-wrapper");
      cmpWrapper.style.display = "block";
      if (request.source.fetchCmp[0] == "cdn.shopify") {
      }
      var para = document.createElement("p");
      para.innerText = request.source.fetchCmp[0];
      para.id = "wp-version";
      if (request.source.fetchCmp[0] != "wordpress") {
        document.getElementById("display-plugins").style.display = "none";
      }
      cmpWrapper.appendChild(para);
      if (request.source.fetchCmp[0] == "wordpress") {
        checkVersions();
      }
    }

    //Check for blacklist
    var blacklistWrapper = document.getElementById("blacklist-wrapper");
    if (request.source.fetchBlacklist.length > 0) {
      blacklistWrapper.style.display = "block";
      var para = document.createElement("p");
      para.innerText = "Blacklist code";
      blacklistWrapper.appendChild(para);
    } else {
      blacklistWrapper.style.display = "none";
    }

    //Next Steps input validation
    //Don't display button if not in admin
    var checkStepsBtn = document.getElementById("check-steps-btn");
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(
      tabs
    ) {
      var url = tabs[0].url;
      if (url.includes("/admin/site/") && url.includes("/admin/site/")) {
        checkStepsBtn.style.display = "block";
      }
    });

    checkStepsBtn.onclick = function() {
      var stepsSubWrapper = document.getElementById("steps-subwrapper");
      var stepsWrapper = document.getElementById("steps-wrapper");

      if (request.source.fetchNextSteps.length > 0) {
        for (var i = 0; i < request.source.fetchNextSteps.length; i++) {
          if (request.source.fetchNextSteps[i] == "na") {
            var para = document.createElement("p");
            para.innerText = "Check in admin edit tab";
            para.style.textAlign = "center";
            stepsWrapper.appendChild(para);
          } else {
            var stepsWrapperTitle = document.querySelectorAll(
              "#steps-wrapper h3"
            );
            stepsWrapperTitle[0].style.display = "block";
            stepsSubWrapper.style.display = "block";
            var para = document.createElement("p");
            para.innerText = request.source.fetchNextSteps[i];
            stepsSubWrapper.appendChild(para);
          }
        }
      } else {
        var icon = document.createElement("i");
        icon.className = "material-icons";
        icon.id = "thumb-up";
        icon.innerText = "thumb_up";
        stepsWrapper.appendChild(icon);
      }
    };
  }
});

//Display site-id
function displaySiteID() {
  chrome.storage.sync.get(["key"], function(result) {
    var siteIdWrapper = document.getElementById("site-id-wrapper");
    var para = document.createElement("p");
    para.innerText = result.key;
    infoJSON.id = result.key;
    siteIdWrapper.appendChild(para);
  })
}

var pluginList;

//Check for plugin/WP version
function checkVersions() {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    var currentTab = tabs[0].url;
    var subUrl = currentTab;
    var urlType;
    
    if (subUrl.indexOf(".org") > -1) {
      urlType = ".org"
      subUrl = subUrl.substring(0, subUrl.indexOf(".org"));
    } else if (subUrl.indexOf(".net") > -1) {
      urlType = ".net"
      subUrl = subUrl.substring(0, subUrl.indexOf(".net"));
    } else if (subUrl.indexOf(".io") > -1) {
      urlType = ".io"
      subUrl = subUrl.substring(0, subUrl.indexOf(".io"));
    } else if (subUrl.indexOf(".co.uk") > -1) {
      urlType = ".co.uk"
      subUrl = subUrl.substring(0, subUrl.indexOf(".co.uk"));
    } else {
      urlType = ".com"
      subUrl = subUrl.substring(0, subUrl.indexOf(".com"));
    }
    fetch(subUrl + urlType + "/wp-admin/admin-ajax.php?action=mv_debug").then(
      response =>
        response
          .json()
          .then(data => ({
            data: data,
            status: response.status
          }))
          .then(res => {
            var promiseArray = res.data.debug.plugins.active;
            var resLength = res.data.debug.plugins.active.length;
            var count = 0;
            console.log("Site JSON Object: ", res)
            infoJSON.name = res.data.name
            pluginList = res.data.debug.plugins.active;
            chrome.storage.local.set({plugins: pluginList}, function() {
              
            });

            for (var i = 0; i < res.data.debug.plugins.active.length; i++){
              console.log(res.data.debug.plugins.active[i].Name + " Version: " + res.data.debug.plugins.active[i].Version);
            }
            //Display theme
            var themeWrapper = document.getElementById("theme-wrapper");
            var para = document.createElement("p");
            infoJSON.theme = res.data.debug.theme.Name;
            para.innerText = res.data.debug.theme.Name;
            themeWrapper.appendChild(para);
            themeWrapper.style.display = "block";

            for (var x = 0; x < resLength; x++) {
              if (promiseArray[x].Name == "Create by Mediavine") {
                createVersion = "Create " + promiseArray[x].Version;
                addVersion(createVersion, "create-mv");
              }
              if (promiseArray[x].Name == "Mediavine Control Panel") {
                mcpVersion = "MCP " + promiseArray[x].Version;
                addVersion(mcpVersion, "mcp");
              }
              if (promiseArray[x].Name == "Mediavine Recipe Importer") {
                importVersion = "MV Importer " + promiseArray[x].Version;
                addVersion(importVersion, "importer-mv");
              }
              if ((promiseArray[x].Name == "Social Warfare" || promiseArray[x].Name == "Social Warfare - Pro") && count == 0) {
                mcpVersion = "Social Warfare " + promiseArray[x].Version;
                addVersion(mcpVersion, "social-warfare");
                count += 1;
              }
              if (promiseArray[x].Name == "Thrive Architect" || promiseArray[x].Name == "Beaver Builder Plugin" || promiseArray[x].Name == "Elementor") {
                var wrapper = document.getElementById("builder-wrapper");
                var para = document.createElement("p");
                para.innerText = promiseArray[x].Name;
                wrapper.appendChild(para);
                wrapper.style.display = "block";
              }
            }

            //append wp version
            var wpVersion = document.getElementById("wp-version");
            infoJSON.platform = "Wordpress " + res.data.version;
            wpVersion.innerText = "Wordpress " + res.data.version;
            checkWordpressVersion(res.data.version);

            getVersion();
          })
          .catch(err => console.log("Reuqest failed:", err))
    );
  });
}

//Takes in WP version the publisher is running
function checkWordpressVersion(currentVersion) {
  var version; //current WP release
  fetch("https://api.wordpress.org/core/version-check/1.7/").then(response =>
    response
      .json()
      .then(data => ({
        data: data,
        status: response.status
      }))
      .then(res => {
        version = res.data.offers[0].current;
        if (version > currentVersion) {
          var wpVersion = document.getElementById("wp-version");
          var inner = wpVersion.innerText;
          wpVersion.innerText = inner.concat(" (" + version + ")");
        }
      })
      .catch(err => console.log(err))
  );
}

//JSON call to get list of plugins
function getVersion() {
  var versions = [];
  let plugins = [
    "https://api.wordpress.org/plugins/info/1.0/mediavine-create.json",
		"https://api.wordpress.org/plugins/info/1.0/mediavine-control-panel.json",
		"https://kernl.us/api/v1/updates/5b104641a89fe95d1d1748c1/"
  ];
  let promises = plugins.map(plugins => fetch(plugins));
  Promise.all(promises).then(response =>
    Promise.all(response.map(r => r.json()))
      .then(data => ({
        data: data,
        status: response.status
      }))
      .then(res => {
        console.log("Promise: ", res)
        for (var x = 0; x < res.data.length; x++) {
          //Create Version
          if (res.data[x].name == "Create by Mediavine") {
            compareVersion("create-mv", res.data[x].version);
          }
          //MCP Version
          if (res.data[x].name == "Mediavine Control Panel") {
            compareVersion("mcp", res.data[x].version);
					}
					if (res.data[x].name == "Mediavine Recipe Importers") {
						compareVersion("importer-mv", res.data[x].version);
          }
        }        
        //Importer Version
        versions.push(res.data[x]);
      })
      .catch(err => console.log(err))
  );
}

var cmpWrapper = document.getElementById("cmp-wrapper");
var createVersionWrapper = document.createElement("div");
createVersionWrapper.id = "version-wrapper";

function addVersion(version, pluginName) {
  cmpWrapper.appendChild(createVersionWrapper);
  var versionPara = document.createElement("p");
  versionPara.innerText = version;
  versionPara.id = pluginName;
  createVersionWrapper.appendChild(versionPara);
}

//Compares plugin versions
function compareVersion(pluginID, latestVersion) {
  if (pluginID == "create-mv") {
    var para = document.getElementById(pluginID);
    var contents = para.innerText;
    if (contents.indexOf(latestVersion) == -1) {
      para.style.fontWeight = "bold";
      para.style.color = "#ff0000ba";
      para.innerText = contents + "(" + latestVersion + ")";
    }
  }
  if (pluginID == "mcp") {
    var para = document.getElementById(pluginID);
    var contents = para.innerText;
    if (contents.indexOf(latestVersion) == -1) {
      para.style.fontWeight = "bold";
      para.style.color = "#ff0000ba";
      para.innerText = contents + "(" + latestVersion + ")";
    }
	}
	if (pluginID == "importer-mv") {
		var para = document.getElementById(pluginID);
    var contents = para.innerText;
    if (contents.indexOf(latestVersion) == -1) {
      para.style.fontWeight = "bold";
      para.style.color = "#ff0000ba";
      para.innerText = contents + "(" + latestVersion + ")";
    }
	}
}

var displayPlugins = document.getElementById("display-plugins");
displayPlugins.onclick = function() {

  if (infoJSON.platform.indexOf("Wordpress") !== -1) {
  //Store site info in cache
  chrome.storage.local.set({siteInfo: infoJSON}, function() {
            
  });
  //Create window to display plugin list
  chrome.windows.create({
    url: chrome.runtime.getURL("pluginList.html"),
    type: "panel",
    height: 800,
    width: 800
  }, function(newWindow) {

    });
  } else {
    //DO NOTHING
  }
};

/**
 * 
 * Ads.txt file validation still in progress. Running into CORS issues.
 * Another reason I should turn the extension into an electron app.
 */

/*var checkButton = document.getElementById("adstxt-btn");
checkButton.onclick = function() {
  checkAdstxt();
};

//Open ads.txt URL
var openButton = document.getElementById("adstxt-open-btn");
openButton.onclick = function() {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    var currentTab = tabs[0].url;
    currentTab = currentTab.replace("https", "http");
    currentTab = currentTab + "ads.txt";
    window.open(currentTab, "_blank");
  });
}; */

//Check to see if the ads.txt file at the url is equal to the current Mediavine ads.txt file
function adsTxtDiffCheck(txtFile) {
  chrome.storage.sync.get(["key"], function(result) {
    fetch("https://dashboard.mediavine.com/sites/" + result.key + "/ads.txt", {
      method: "get"
    })
      .then(function(response) {
        response.text().then(function(text) {
          var light = document.getElementById("adstxt-status-light");
          var redirectedWrapper = document.getElementById("redirected-wrapper");
          var redirectedTitle = document.getElementById("redirected-title");
          //check number of lines
          if (txtFile.length != text.length) {
            light.style.background = "#ff9c00";
            light.style.display = "block";
            redirectedWrapper.style.display = "block";
            redirectedTitle.innerText = "Out of date";
            console.log("different");
            console.log("Current Ads.txt:");
            console.log(txtFile);
            console.log("Correct Ads.txt:");
            console.log(text);
          } else {
            light.style.background = "#41a5a9";
            light.style.display = "block";
            console.log("same");
          }
        });
      })
      .catch(function(err) {
        // Error
        console.log(err);
      });
  });
}

//Check for stripped down ads.txt url
//Uses heroku because CORS policy sucks
function checkAdstxt() {
  // chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  //   var currentTab = tabs[0].url;
  //   var subUrl = currentTab;
  //   subUrl = subUrl.replace("https", "http");
  //   subUrl = subUrl.replace("www.", "");
  //   subUrl = subUrl + "ads.txt";
  //   fetch("https://cors-anywhere.herokuapp.com/" + subUrl)
  //     .then(function(response) {
  //       var redirectedUrl = response.url;
  //       var light = document.getElementById("adstxt-status-light");
  //       var redirectedTitle = document.getElementById("redirected-title");
  //       var redirectedTitleUrl = document.getElementById("redirected-url");
  //       var redirectedWrapper = document.getElementById("redirected-wrapper");

  //       console.log(response);
  //       if (response.status == 200) {
  //         if (response.redirected == false) {
  //           openButton.style.display = "block";
  //           //run diff checker on ads.txt files
  //           response.text().then(function(textFile) {
  //             adsTxtDiffCheck(textFile);
  //           });
  //         } else if (
  //           response.redirected == true &&
  //           redirectedUrl.includes("/ads.txt")
  //         ) {
  //           redirectedWrapper.style.display = "block";
  //           redirectedTitleUrl.innerText = redirectedUrl;
  //           openButton.style.display = "block";
  //           //run diff checker on ads.txt files
  //           response.text().then(function(textFile) {
  //             adsTxtDiffCheck(textFile);
  //           });
  //         } else {
  //           light.style.background = "red";
  //           light.style.display = "block";
  //           redirectedWrapper.style.display = "block";
  //           redirectedTitleUrl.innerText = redirectedUrl;
  //           openButton.style.display = "block";
  //           openButton.style.color = "red";
  //         }
  //       } else {
  //         light.style.background = "red";
  //         light.style.display = "block";
  //         redirectedWrapper.style.display = "block";
  //         redirectedTitle.innerText = response.status + " error";
  //         openButton.style.display = "block";
  //         openButton.style.color = "red";
  //       }
  //     })
  //     .catch(function(err) {
  //       // Error
  //       console.log(err);
  //     });
  // });
}

console.log(infoJSON)

function onWindowLoad() {
  var message = document.querySelector("#message");

  chrome.tabs.executeScript(
    null,
    {
      file: "getPagesSource.js"
    },
    function() {
      //Incase error
      if (chrome.runtime.lastError) {
        message.innerText ="There was an error executing script : \n" +
          chrome.runtime.lastError.message;
      }
    }
  );
}

window.onload = onWindowLoad;