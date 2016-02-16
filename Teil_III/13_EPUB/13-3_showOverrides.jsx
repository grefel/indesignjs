if (app.documents.length > 0 && app.activeWindow.constructor.name == "LayoutWindow") {
	var _dok = app.activeDocument;
	if (_dok.textPreferences.enableStylePreviewMode == false) {
		app.activeWindow.screenMode = ScreenModeOptions.previewOff;
		app.activeWindow.overprintPreview = false;
		_dok.textPreferences.enableStylePreviewMode = true; 
	} else {
		_dok.textPreferences.enableStylePreviewMode = false; 

	}
}