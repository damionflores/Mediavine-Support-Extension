// //validate next steps
// var nextSteps = [];
// var titleInput = document.querySelectorAll("#site_title");
// console.log(titleInput[0].value)
// if(titleInput[0].value == "" || titleInput[0].value == " ") {
//    nextSteps.push("Site Title");
// }

// var domainInput = document.querySelectorAll("#site_domain");
// console.log(domainInput[0].value)
// if(domainInput[0].value == "" || domainInput[0].value == " ") {
//    nextSteps.push("Domain");
// }

// var categoryInput = document.querySelectorAll("#site_category_id_field input");
// console.log(categoryInput[0].value)
// if(categoryInput[0].value == "" || categoryInput[0].value == " ") {
//    nextSteps.push("Category");
// }

// var gaInput = document.querySelectorAll("#site_ganalytics_id_field input");
// console.log(gaInput[0].value)
// if(gaInput[0].value == "" || gaInput[0].value == " ") {
//    nextSteps.push("GA ID");
// }

// var dfpInput = document.querySelectorAll("#site_adunit_field input");
// console.log(dfpInput[0].value)
// if(dfpInput[0].value == "" || dfpInput[0].value == " ") {
//    nextSteps.push("DFP Slot Name");
// }

// var atfInput = document.querySelectorAll("#site_sidebar_atf_selector_field input");
// console.log(atfInput[0].value)
// if(atfInput[0].value == "" || atfInput[0].value == " ") {
//    nextSteps.push("ATF Selector");
// }

// var btfInput = document.querySelectorAll("#site_sidebar_btf_selector_field input");
// console.log(btfInput[0].value)
// if(btfInput[0].value == "" || btfInput[0].value == " ") {
//    nextSteps.push("BTF Selector");
// }

// var stopSelectorInput = document.querySelectorAll("#site_sidebar_btf_stop_selector_field input");
// console.log(stopSelectorInput[0].value)
// if(stopSelectorInput[0].value == "" || stopSelectorInput[0].value == " ") {
//    nextSteps.push("Stop Selector");
// }

// var minWidthInput = document.querySelectorAll("#site_sidebar_minimum_width_field input");
// console.log(minWidthInput[0].value)
// if(minWidthInput[0].value == "" || minWidthInput[0].value == " ") {
//    nextSteps.push("Min Width");
// }

// var recipeDesktopInput = document.querySelectorAll("#site_recipe_selector_field input");
// console.log(recipeDesktopInput[0].value)
// if(recipeDesktopInput[0].value == "" || recipeDesktopInput[0].value == " ") {
//    nextSteps.push("Recipe Desktop Selector");
// }

// var recipeMobileInput = document.querySelectorAll("#site_recipe_mobile_selector_field input");
// console.log(recipeMobileInput[0].value)
// if(recipeMobileInput[0].value == "" || recipeMobileInput[0].value == " ") {
//    nextSteps.push("Recipe Mobile Selector");
// }

// var contentSelectorInput = document.querySelectorAll("#site_content_selector_field input");
// console.log(contentSelectorInput[0].value)
// if(contentSelectorInput[0].value == "" || contentSelectorInput[0].value == " ") {
//    nextSteps.push("Content Selector");
// }

// var comscoreInput = document.querySelectorAll("#site_footer_selector_field input");
// console.log(comscoreInput[0].value)
// if(comscoreInput[0].value == "" || comscoreInput[0].value == " ") {
//    nextSteps.push("Comsore Selector");
// }

// var gumgumInput = document.querySelectorAll("#site_gumgum_id_field input");
// console.log(gumgumInput[0].value)
// if(gumgumInput[0].value == "" || gumgumInput[0].value == " ") {
//    nextSteps.push("GumGum Zone ID");
// }

// //Send data to popup.js to handle
// chrome.runtime.sendMessage({
//     action: "checkNext",
//     source: nextSteps
//  });