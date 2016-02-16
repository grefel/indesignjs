if (app.documents.length > 0 && app.activeDocument.layoutWindows.length > 0) {
	var _ial = app.scriptPreferences.userInteractionLevel;
	app.scriptPreferences.userInteractionLevel = UserInteractionLevels.INTERACT_WITH_ALL;
	bilderVerankern();
	app.scriptPreferences.userInteractionLevel = _ial;
}
else {
	alert("Kein Dokuemnt geöffnet", "Hinweis");
}

function bilderVerankern () {
	var _dok = app.documents[0];
	var _graphicsMap = {};
	for (var i = 0; i < _dok.allGraphics.length; i++) {
		var _graphic = _dok.allGraphics[i]
		var _name = _graphic.itemLink.name;
		if (_name.match(/^(\d+)_/)) {
			var _linkNr = _name.match(/^(\d+)_/)[1];
			_graphicsMap[_linkNr] = _graphic;
		}
	}
	app.findGrepPreferences = NothingEnum.nothing;
	if (app.findChangeGrepOptions.hasOwnProperty ("searchBackwards")) {
		app.findChangeGrepOptions.searchBackwards = false;
	}
	app.findGrepPreferences.findWhat = "(?<=\\(Abbildung\\h)\\d+(?=\\))";
	var _ergebnisse = _dok.findGrep(true);
	for (var i =0; i < _ergebnisse.length ; i++) {
		var _abbRef = _ergebnisse[i];
		var _bildNr = _abbRef.contents;
		if (_graphicsMap[_bildNr] != undefined) {
			var _story = _abbRef.parentStory;
			var _newIndex = _abbRef.insertionPoints[-1].index  + 1;
			var _ip = _story.insertionPoints[_newIndex];
			var _pageItem = _graphicsMap[_bildNr].parent;
			_pageItem.anchoredObjectSettings.insertAnchoredObject(_ip, AnchorPosition.ANCHORED); 
		}
	}
	app.findGrepPreferences = NothingEnum.nothing;
}