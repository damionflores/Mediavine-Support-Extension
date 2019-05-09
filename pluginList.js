
/**
 * PluginList.js
 * 
 * Display plugins easability.
 * 
 * Lets user select a list of plugins to copy to the clipboard. Usefull when relaying info to engineers or creating GIT issues
 */

var pluginList = [];

//Access plugin info from storage
chrome.storage.local.get(["plugins"], function(result) {

  var pluginWrapper = document.getElementById("active-plugins");
  var pluginHeader = document.createElement("h3");
  var ul = document.createElement("ul");
  ul.setAttribute('id', 'plugin-list');

  pluginHeader.classList.add("section-title")

  pluginHeader.innerText = "Active Plugins"
  pluginWrapper.prepend(pluginHeader);
  pluginWrapper.appendChild(ul);

  for (var i = 0; i < result.plugins.length; i++) {

    if (result.plugins[i].Author == "Mediavine" || result.plugins[i].Author == "mediavine") {
      var li = document.createElement("li");
      var p = document.createElement("p");
      p.innerText = result.plugins[i].Name;
      li.appendChild(p);
      li.addEventListener('click', selectPlugin)
      ul.prepend(li);
      li.style.border = "solid 2px #41a5a9"
    } else {
      var li = document.createElement("li");
      var p = document.createElement("p");
      p.innerText = result.plugins[i].Name;
      li.addEventListener('click', selectPlugin)
      li.appendChild(p);
      ul.appendChild(li);
    }

    var version = document.createElement("p");
    version.innerText = "Version: " + result.plugins[i].Version;
    li.appendChild(version);
  }

  console.log(result.plugins)

});

var selectPlugin = function(e) {
  console.log(e)
  var selected;
  if(e.target.localName == "li") {
    // do the thang
    selected = e.target;
    
    //add/remove selected-item class
    if(!(selected.classList.contains('selected-item'))){
      selected.setAttribute('class', 'selected-item');
      copyToClipboard(selected.innerText)
    } else {
      selected.classList.remove('selected-item');
      removeFromClipboard(selected.innerText);
    }
  } else if (e.target.localName == "p") {
    //get parent
    selected = e.target.parentElement;

    //add/remove selected-item class
    if(!(selected.classList.contains('selected-item'))){
      selected.setAttribute('class', 'selected-item');
      copyToClipboard(selected.innerText)
    } else {
      selected.classList.remove('selected-item');
      removeFromClipboard(selected.innerText);
    }
  } else {
    //Error targeting element
    console.log("Error selecting target element")
  }
}

var cbText = [];
const el = document.createElement('textarea');
function copyToClipboard(pluginName) {
  cbText.push(pluginName);
}

function removeFromClipboard(pluginName) {
  cbText.splice( cbText.indexOf(pluginName), 1);
}

var copyBtn = document.getElementById("clipboard-btn");
copyBtn.onclick = function() {

  if(cbText.length > 0) {
    // Create new element
    var el = document.createElement('textarea');
    el.value += document.getElementById("site-title").innerText + ":\n\n";
    // Set value (string to be copied)
    for(var i = 0; i < cbText.length; i++) {
      var temp = cbText[i].replace(/\n\n|\r\r/g, " --> ");
      el.value += temp + "\n\n";
    }
    // Set non-editable to avoid focus and move outside of view
    el.setAttribute('readonly', '');
    el.style = {position: 'absolute', left: '-9999px'};
    document.body.appendChild(el);
    // Select text inside element
    el.select();
    // Copy text to clipboard
    document.execCommand('copy');
    // Remove temporary element
    document.body.removeChild(el);

    var t = document.createElement("p");
    t.innerText = "Copied to clipboard!"
    t.setAttribute("style", "position: fixed; bottom: 60px; right: 30px;")
    t.setAttribute("class", "copied-text")
    document.body.appendChild(t)
  } else {
    console.log("Nothing to copy to clipboard!")
  }
}

//Access site info from storage
chrome.storage.local.get(["siteInfo"], function(result) {

  if (result != undefined) {

    var title = document.getElementById("site-title");
    title.innerText = result.siteInfo.name;

    var infoContainer = document.createElement("div");
    var infoWrapper = document.getElementById("site-info");
    var sectionHeader = document.createElement("h3");

    sectionHeader.innerText = "Site Info";
    sectionHeader.classList.add("section-title");
    infoWrapper.appendChild(sectionHeader);
    infoWrapper.appendChild(infoContainer);

    var theme = document.createElement("p");
    var platform = document.createElement("p");
    var siteId = document.createElement("p");

    theme.innerText = "Theme: " + result.siteInfo.theme;
    platform.innerText = "Platform: " + result.siteInfo.platform;
    siteId.innerText = "Site ID: " + result.siteInfo.id;

    infoContainer.appendChild(siteId);
    infoContainer.appendChild(theme);
    infoContainer.appendChild(platform);
  }
});

var input = document.getElementById('search');
input.onkeyup = function() {
    // Declare variables
    var filter, ul, li, a, i, txtValue;
    filter = input.value.toUpperCase();
    ul = document.getElementById("plugin-list");
    li = ul.getElementsByTagName('li');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        p = li[i].getElementsByTagName("p")[0];
        txtValue = p.textContent || p.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}