tagsExport()
function tagsExport() {
	if (app.scriptPreferences.version < 10) {
		alert ("Für Diese Skript wird InDesign CC 2014 benötigt");
		return;
	}
	if (app.documents.length == 0 && app.activeDocument.layoutWindows.length > 0) { 
		alert ("Kein Dokuemnt geöffnet!");
		return;
	}
	var _dok = app.documents[0];
	for (var i = 1; i < _dok.allParagraphStyles.length; i++) {
		var _pStyle = _dok.allParagraphStyles[i];
		var _className = _pStyle.name;		
		_className = _className.replace(/[^\w\d-]/g, "_");
		var _elementTag = "p";
		for (var j = _pStyle.styleExportTagMaps.length - 1; j >= 0; j--) {
			var _exportMap = _pStyle.styleExportTagMaps[j];
			if (_exportMap.exportType == "EPUB") _exportMap.remove();
		}
		_pStyle.styleExportTagMaps.add("EPUB", _elementTag, _className, "");
		_pStyle.emitCss = true;
		_pStyle.splitDocument = false;
	}
}