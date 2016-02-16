if (app.documents.length > 0 && app.activeDocument.layoutWindows.length > 0) {
	var _ial = app.scriptPreferences.userInteractionLevel;
	app.scriptPreferences.userInteractionLevel = UserInteractionLevels.INTERACT_WITH_ALL;
	epubPreflight();
	app.scriptPreferences.userInteractionLevel = _ial;
}
else {
	alert("Kein Dokuemnt geöffnet", "Hinweis");
}

function epubPreflight() {
	var _dok = app.documents[0];
	for (var i = 0; i < _dok.allGraphics.length; i++) {
		var _abb = _dok.allGraphics[i];
		var _bildName = _abb.itemLink.name;
		var _pageItem = _abb.parent;
		if (_pageItem.parent.constructor.name != "Character") {
			showIt(_pageItem);
			if (!confirm("Das Bild [" + _bildName + "] ist nicht verankert!\nWeiter prüfen?")) return;
		}
		if (_abb.parent.appliedObjectStyle.name.indexOf("[") == 0) {
			showIt(_pageItem);
			if (!confirm("Der Rahmen des Bildes [" + _bildName + "] wurde nicht mit einem individuellen Objketformat ausgezeichnet!\nWeiter prüfen?")) return;
		}
		if (_pageItem.objectExportOptions.altText() == "") {
			showIt(_pageItem);
			if (!confirm("Das Bild [" + _bildName + "] hat keinen alternativen Text!\nWeiter prüfen?")) return;
		}
	}
}

function showIt (_object) {
	if (_object != null) {
		if (_object.hasOwnProperty ("sourcePageItem")) _object = _object.sourcePageItem;
		if (_object.hasOwnProperty ("sourceText")) _object = _object.sourceText;
		var _spread = getSpreadByObject (_object);
		if (_spread != null) {
			var _dok = _spread.parent;
			if (_dok.layoutWindows.length > 0 && (app.activeWindow.parent != _dok || app.activeWindow.constructor.name == "StoryWindow" )) {
				app.activeWindow = _dok.layoutWindows[0];
			}
			app.activeWindow.activeSpread = _spread;
		}
		app.select(_object);
		var myZoom = app.activeWindow.zoomPercentage; 
		app.activeWindow.zoom(ZoomOptions.showPasteboard); 
		app.activeWindow.zoomPercentage = myZoom;
		return true;
	}
	else {
		return false;
	}
}

function getSpreadByObject (_object) {
	if (_object != null) {
		_object = _object.getElements ()[0]; // Problems with Baseclass Objects like PageItem in CS5!
		if (_object.hasOwnProperty("baseline")) {
			_object = _object.parentTextFrames[0];
		}
		while (_object != null) {
			var whatIsIt = _object.constructor;
			switch (whatIsIt) {
				case Spread : return _object;
				case MasterSpread : return _object;
				case Character : _object = _object.parentTextFrames[0]; break;
				case Footnote :; // drop through
				case Cell : _object = _object.insertionPoints[0].parentTextFrames[0]; break;
				case Note : _object = _object.storyOffset.parentTextFrames[0]; break;
				case XMLElement : if (_object.insertionPoints[0].isValid) { _object = _object.insertionPoints[0].parentTextFrames[0]; break; }
				case Application : return null;
				default: _object = _object.parent;
			}
			if (_object == null) return null;
		}
		return _object;
	} 
	else {
		return null;
	}
}