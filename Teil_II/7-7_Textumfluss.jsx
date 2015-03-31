var _dok = app.activeDocument;
with (_dok.textPreferences) {
	smartTextReflow = true;
	limitToMasterTextFrames = true;
	addPages = AddPageOptions.END_OF_STORY;
	preserveFacingPageSpreads = true;
	deleteEmptyPages = false;	
}