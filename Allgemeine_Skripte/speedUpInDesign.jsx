//DESCRIPTION Speed up InDesign 
/*
	This script is inspired by Erica Gamet article on InDesign Secrets
	http://indesignsecrets.com/6-tips-speed-up-indesign.php
	
	@Date:  2018-11-30
	@Author: Gregor Fellenz http://www.publishingx.de 
	@Version: 1.2
*/

if (app.extractLabel("px:speedUpState") == "") {
	speedUp();
	app.insertLabel("px:speedUpState", "set");
	alert ("Set speed preferences!\rRestore old values by running the script again.", "Speed up InDesign");
}
else {
	restore();
	app.insertLabel("px:speedUpState", "");
	alert ("Restored old values!\rYou want speed? run the script again.", "Speed up InDesign");
}

function speedUp() {
	savePreference("app.displayPerformancePreferences.defaultDisplaySettings", app.displayPerformancePreferences.defaultDisplaySettings) 
	app.displayPerformancePreferences.defaultDisplaySettings = ViewDisplaySettings.TYPICAL;

	savePreference("app.liveScreenDrawing", app.liveScreenDrawing);
	app.liveScreenDrawing = LiveDrawingOptions.NEVER;

	savePreference("app.preflightOptions.preflightOff", app.preflightOptions.preflightOff);
	app.preflightOptions.preflightOff = true;

	for (var i = 0; i < app.panels.length; i++) {
		try {
			if (app.panels[i].hasOwnProperty("pagesThumbnails") ) {
				savePreference("app.panels[i].pagesThumbnails", app.panels[i].pagesThumbnails);
				app.panels[i].pagesThumbnails = false;
			}
		} catch (error) {
			
		}
	}

	//~ Turn off "AutoUpdateURLStatus" from "Hyperlinks" panel - Thanks to Uwe Laubender for the workaround
	var autoUpdateURLStatus = app.menuActions.itemByName("$ID/AutoUpdateURLStatus");
	var hyperLinksPanel = app.panels.itemByName("$ID/Hyperlinks");
	var visibility = hyperLinksPanel.visible;

	if (!visibility) {
		hyperLinksPanel.visible = true
	}
	savePreference("autoUpdateURLStatus", autoUpdateURLStatus.checked);
	if (autoUpdateURLStatus.checked) {
		autoUpdateURLStatus.invoke();
	}
	hyperLinksPanel.visible = visibility;

	savePreference("app.generalPreferences.includePreview", app.generalPreferences.includePreview);
	app.generalPreferences.includePreview = false;
}
function savePreference (prefname, setting) {
	app.insertLabel("px:savePref" + prefname, setting.valueOf() + "");
}

function restore() {
	var setting = getPreference("app.displayPerformancePreferences.defaultDisplaySettings") 
	if (setting != undefined) app.displayPerformancePreferences.defaultDisplaySettings = setting;

	setting = getPreference("app.liveScreenDrawing");
	if (setting != undefined) app.liveScreenDrawing = setting;

	setting = getPreference("app.preflightOptions.preflightOff");
	if (setting != undefined) app.preflightOptions.preflightOff = setting;

	for (var i = 0; i < app.panels.length; i++) {
		if (app.panels[i].hasOwnProperty("pagesThumbnails") ) {
			setting = getPreference("app.panels[i].pagesThumbnails");
			if (setting != undefined) app.panels[i].pagesThumbnails = setting;
			break;
		}
	}

	//~ Turn off "AutoUpdateURLStatus" from "Hyperlinks" panel - Thanks to Uwe Laubender for the workaround
	var autoUpdateURLStatus = app.menuActions.itemByName("$ID/AutoUpdateURLStatus");
	setting = getPreference("autoUpdateURLStatus");
	var hyperLinksPanel = app.panels.itemByName("$ID/Hyperlinks");
	var visibility = hyperLinksPanel.visible;

	if (!visibility) {
		hyperLinksPanel.visible = true
	}
	if (autoUpdateURLStatus.checked != setting) {
		autoUpdateURLStatus.invoke();
	}
	hyperLinksPanel.visible = visibility;

	setting = getPreference("app.generalPreferences.includePreview");
	if (setting != undefined) app.generalPreferences.includePreview = setting;

}
function getPreference (prefname) {
	var setting = app.extractLabel("px:savePref" + prefname);
	if (setting === "") return undefined;
	if (setting === "true") return true;
	if (setting === "false") return false;
	return setting * 1;
}
