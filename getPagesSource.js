
//Clear any stored data from previous sites.
chrome.storage.local.clear(function(obj){
   console.log("Local storage cleared");
});
chrome.storage.sync.clear(function(obj){
   console.log("Chrome storage cleared");
});

//array of ad networks and potential conflicts
var adArray = [
   "adsby",
   "lijit",
   "media.net",
   "adthrive",
   "tbn",
   "monu",
   "grm",
   "gourmet",
   "viglinks",
   "ezoic",
   "freestar",
   "rev.content",
   "disqus",
   "lazy",
   "dojo",
   "//scripts.mediavine.com/tags",
   "tynt",
   "sekindo",
   "rocketscript",
   "blogherads",
   "outbrain",
   "video.mediavine",
   "chicoryapp"
]

//Blacklisted ad code
var blacklistArray = [
   "data-blacklist-all",
   "data-blacklist-sidebar-atf",
   "data-blacklist-sidebar-btf",
   "data-blacklist-content-desktop",
   "data-blacklist-content-mobile",
   "data-blacklist-adhesion-mobile",
   "data-blacklist-adhesion-desktop",
   "data-blacklist-recipe",
   "data-blacklist-auto-insert-sticky"
]

//CMP's
var cmp = [
   "wp-content",
   "www.blogger.com",
   "squarespace",
   "wix",
   "sbi_html",
   "cdn.shopify"
]

var builderTheme = [
   "et_pb_builder",
   "thrive-architect",
   "elementor"
]

//Content hints
var hintArray = [
   "content_hint",
   "content_desktop_hint",
   "content_mobile_hint"
]


var mvCreate = document.getElementsByClassName("mv-create-card");
var isCreate = [];
if (mvCreate.length > 0){
   isCreate[0] = "mediavine-create";
}

//get scripts by src
var scripts = document.querySelectorAll('script[src]');
var scriptsInner = document.querySelectorAll('script');
//get links by href
var linkTags = document.querySelectorAll('link[href]');

var scriptsFound = [];
var tempArray = [];
var cmpFound = [];
var mvScript = [];

var count = 0;
var siteId;
//get site ID
for (var i = 0; i < scripts.length; i++) {
   if(scripts[i].src.split('/tags/')[1] != undefined) {
      var temp = scripts[i].src.split('/tags/')[1];
      temp = temp.split('.js')[0];
      if(temp.indexOf('/') == -1 ) {
         siteId = temp;

         //Store Site ID in Chrome storage
         chrome.storage.sync.set({key: siteId}, function() {
            
          });
      }
   }
}

//Checking CMP array against meta tags for special sites
var cmpMeta = document.querySelectorAll('meta[content]');
for (var i = 0; i < cmpMeta.length; i++) {
   if(cmpMeta[i].content.includes("Joomla")) {
      cmpFound.push("Joomla");
   }
}

//search through array of scripts to find ad networks
//save found scripts to new array to be passed to popup.js
for (var i = 0; i < scripts.length; i++) {
   for (var x = 0; x < adArray.length; x++) {
      if (scripts[i].outerHTML.indexOf(adArray[x]) > -1) {
         if(scriptsFound.indexOf(adArray[x]) == -1) {
            scriptsFound.push(adArray[x]);
         }
      }
   }
}

//Check for ads in scripts with no src.
for (var i = 0; i < scriptsInner.length; i++) {
   for (var x = 0; x < adArray.length; x++) {
      if (scriptsInner[i].innerHTML.indexOf(adArray[x]) > -1) {
         if(scriptsFound.indexOf(adArray[x]) == -1) {
            scriptsFound.push(adArray[x]);
         }
      }
   }
}

//Search link tags for CMP
var isWordpress = true;
for (var i = 0; i < linkTags.length; i++){
   for (var x = 0; x < cmp.length; x++) {
      if (linkTags[i].outerHTML.indexOf(cmp[x]) > -1) {
         if(cmpFound.indexOf(cmp[x]) == -1) {
            if(cmp[x] == "wp-content") {
               cmpFound.push("wordpress");
               isWordpress = false;
               break;
            }
            if (cmp[x] != "wp-content") {
               if(cmp[x] == "www.blogger.com"){
                  cmpFound.push("blogger");
                  break;
               } else {
               cmpFound.push(cmp[x]);
               break;
               }
            }
         }
      }
   }
}

//checks for SBI site
var isSBI = "";
var nodeIterator = document.createNodeIterator(
   document.body,
   NodeFilter.SHOW_COMMENT,    
   { acceptNode: function(node) { return NodeFilter.FILTER_ACCEPT; } }
);

// Replace all comment nodes with a div
while(nodeIterator.nextNode()){
   var commentNode = nodeIterator.referenceNode;
   var sbiNode = commentNode.textContent;
   if(sbiNode.includes("sbi_html")){
      isSBI = "SBI"
      cmpFound.push(isSBI);
      break;
   }
}

//Check for blacklist code
var blacklistDiv = document.getElementById("mediavine-settings");

var blacklistAD = [];
if (blacklistDiv != null) {
   for (var i = 0; i < blacklistArray.length; i++) {
      if (blacklistDiv.getAttribute(blacklistArray[i]) > 0) {
         blacklistAD[0] = blacklistArray[i];
      }
   }
}

//Check for content hints
var hint;
var contentHints = []
for (var i = 0; i < hintArray.length; i++) {
   var temp = document.getElementsByClassName(hintArray[i])
   if (temp.length > 0) {
      contentHints[0] = hintArray[i];
   }
}

var url = window.location.hostname;
var fullUrl = window.location.href;
var bareUrl = url.replace("www.", "");
var adsTxtUrl = "http://" + bareUrl + "/ads.txt";

//Validation to make sure the required fields are filled out when adding a new site to the dashboard
var nextSteps = [];
if (fullUrl.includes("/admin/site/") && fullUrl.includes("/edit") ){
   var titleInput = document.querySelectorAll("#site_title_field input");
   if(titleInput[0].value == "" || titleInput[0].value == " ") {
      nextSteps.push("Site Title");
   }

   var domainInput = document.querySelectorAll("#site_domain_field input");
   console.log(domainInput[0].value)
   if(domainInput[0].value == "" || domainInput[0].value == " ") {
      nextSteps.push("Domain");
   }

   var categoryInput = document.querySelectorAll("#site_category_id_field input");
   console.log(categoryInput[0].value)
   if(categoryInput[0].value == "" || categoryInput[0].value == " ") {
      nextSteps.push("Category");
   }

   var gaInput = document.querySelectorAll("#site_ganalytics_id_field input");
   console.log(gaInput[0].value)
   if(gaInput[0].value == "" || gaInput[0].value == " ") {
      nextSteps.push("GA ID");
   }

   var dfpInput = document.querySelectorAll("#site_adunit_field input");
   console.log(dfpInput[0].value)
   if(dfpInput[0].value == "" || dfpInput[0].value == " ") {
      nextSteps.push("DFP Slot Name");
   }

   var atfInput = document.querySelectorAll("#site_sidebar_atf_selector_field input");
   console.log(atfInput[0].value)
   if(atfInput[0].value == "" || atfInput[0].value == " ") {
      nextSteps.push("ATF Selector");
   }

   var btfInput = document.querySelectorAll("#site_sidebar_btf_selector_field input");
   console.log(btfInput[0].value)
   if(btfInput[0].value == "" || btfInput[0].value == " ") {
      nextSteps.push("BTF Selector");
   }

   var stopSelectorInput = document.querySelectorAll("#site_sidebar_btf_stop_selector_field input");
   console.log(stopSelectorInput[0].value)
   if(stopSelectorInput[0].value == "" || stopSelectorInput[0].value == " ") {
      nextSteps.push("Stop Selector");
   }

   var minWidthInput = document.querySelectorAll("#site_sidebar_minimum_width_field input");
   console.log(minWidthInput[0].value)
   if(minWidthInput[0].value == "" || minWidthInput[0].value == " ") {
      nextSteps.push("Min Width");
   }

   var recipeDesktopInput = document.querySelectorAll("#site_recipe_selector_field input");
   console.log(recipeDesktopInput[0].value)
   if(recipeDesktopInput[0].value == "" || recipeDesktopInput[0].value == " ") {
      nextSteps.push("Recipe Desktop Selector");
   }

   var recipeMobileInput = document.querySelectorAll("#site_recipe_mobile_selector_field input");
   console.log(recipeMobileInput[0].value)
   if(recipeMobileInput[0].value == "" || recipeMobileInput[0].value == " ") {
      nextSteps.push("Recipe Mobile Selector");
   }

   var contentSelectorInput = document.querySelectorAll("#site_content_selector_field input");
   console.log(contentSelectorInput[0].value)
   if(contentSelectorInput[0].value == "" || contentSelectorInput[0].value == " ") {
      nextSteps.push("Content Selector");
   }

   var comscoreInput = document.querySelectorAll("#site_footer_selector_field input");
   console.log(comscoreInput[0].value)
   if(comscoreInput[0].value == "" || comscoreInput[0].value == " ") {
      nextSteps.push("Comsore Selector");
   }

   var gumgumInput = document.querySelectorAll("#site_gumgum_id_field input");
   console.log(gumgumInput[0].value)
   if(gumgumInput[0].value == "" || gumgumInput[0].value == " ") {
      nextSteps.push("GumGum Zone ID");
   }
} else {
   nextSteps.push("na");
}

//Check page type
var pageType;
if(document.body.classList.contains('single-post')) {
   pageType = "post";
}

if(document.body.classList.contains('page')) {
   pageType = "page";
}

if(document.body.classList.contains('category')) {
   pageType = "category";
}

if(document.body.classList.contains('archive')) {
   pageType = "archive";
}


//Send data to popup.js to handle
chrome.runtime.sendMessage({
   action: "getSource",
   source: {
      fetchConflicts: scriptsFound,
      fetchCmp: cmpFound,
      fetchBlacklist: blacklistAD,
      fetchCreate: isCreate,
      fetchHints: contentHints,
      fetchUrl: adsTxtUrl,
      fetchSiteId: siteId,
      fetchNextSteps: nextSteps,
      pageType: pageType
   }
});