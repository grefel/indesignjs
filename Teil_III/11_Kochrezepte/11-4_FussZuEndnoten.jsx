if (app.documents.length > 0) {
	var _dok = app.activeDocument;
	var _rulerOrigin = _dok.viewPreferences.rulerOrigin;
	_dok.viewPreferences.rulerOrigin = RulerOrigin.PAGE_ORIGIN;
	var _zeroPoint = _dok.zeroPoint;
	_dok.zeroPoint = [0,0];
	app.doScript(fussZuEnd, ScriptLanguage.JAVASCRIPT, _dok, UndoModes.ENTIRE_SCRIPT, "Fuß- zu Endnoten konvertieren"); 		
	_dok.viewPreferences.rulerOrigin =_rulerOrigin;		
	_dok.zeroPoint = _zeroPoint;
} else {
	alert ("Kein Dokument geöffnet!")
}

// Wandelt Fußnoten in Endnoten mit Querverweisen um 
function fussZuEnd(_dok) {
	var _tf = addPageTextFrame(_dok.pages[-1]);
	_tf.contents = "Endnoten"
	var _allFootN = _dok.stories.everyItem().footnotes.everyItem().getElements();
	for (var j = 0; j < _allFootN.length; j++) {
		var _footN = _allFootN[j];
		_tf.parentStory.insertionPoints[-1].contents = "\r";
		var _endN = _footN.texts[0].move (LocationOptions.AFTER, _tf.parentStory.paragraphs[-1]);
		var _absF = _dok.paragraphStyles.itemByName("Endnote");
		_endN.appliedParagraphStyle = _absF;
		var _querVF = _dok.crossReferenceFormats.itemByName("Endnote");
		var _quelle = _dok.crossReferenceSources.add (_footN.storyOffset, _querVF);
		var _ziel = _dok.paragraphDestinations.add (_endN.insertionPoints[0]);		
		var _querV = _dok.hyperlinks.add (_quelle, _ziel);
		_querV.visible = false;
	} 
	app.findGrepPreferences = NothingEnum.NOTHING;
	app.changeGrepPreferences = NothingEnum.NOTHING;
	app.findChangeGrepOptions.includeFootnotes = true;
	app.findGrepPreferences.findWhat = "~F\\t?";
	_dok.changeGrep();
	app.findGrepPreferences = NothingEnum.NOTHING
	app.changeGrepPreferences = NothingEnum.NOTHING;	
	_dok.crossReferenceSources.everyItem().update();
}

// Fügt eine neue Seite mit einen Textrahmen in der Größe des Satzspiegels hinzu
function addPageTextFrame (_page, _master, _newPage) {
	if (_newPage == undefined)  _newPage = true;
	var _dok = _page.parent.parent;
	if (_newPage ) {
		var _newPage = _dok.pages.add(LocationOptions.AFTER, _page);
		if (_master == undefined) _newPage.appliedMaster = _page.appliedMaster;
		else _newPage.appliedMaster = _master;
	}
	else {
		var _newPage = _page;
	}
	var _y1 = _newPage.marginPreferences.top;
	var _y2 = _dok.documentPreferences.pageHeight - _newPage.marginPreferences.bottom;
	if (_newPage.side == PageSideOptions.LEFT_HAND) {
		var _x1 = _newPage.marginPreferences.right;
		var _x2 = _dok.documentPreferences.pageWidth - _newPage.marginPreferences.left;
	} 
	else {
		var _x1 = _newPage.marginPreferences.left;
		var _x2 = _dok.documentPreferences.pageWidth - _newPage.marginPreferences.right;
	}
	var _tf = _newPage.textFrames.add();
	_tf.geometricBounds = [_y1 , _x1 , _y2 , _x2];	
	_tf.textFramePreferences.textColumnCount = _newPage.marginPreferences.columnCount;
	_tf.textFramePreferences.textColumnGutter =  _newPage.marginPreferences.columnGutter	
	return _tf;
}