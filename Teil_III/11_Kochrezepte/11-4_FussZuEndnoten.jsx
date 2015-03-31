#target InDesign
if (app.documents.length > 0) {
	var _dok = app.activeDocument;
	var _rulerOrigin = _dok.viewPreferences.rulerOrigin;
	_dok.viewPreferences.rulerOrigin = RulerOrigin.PAGE_ORIGIN;
	var _zeroPoint = _dok.zeroPoint;
	_dok.zeroPoint = [0,0];
	if (app.scriptPreferences.version >= 6 ) { // Ab CS4 Undo bereitstellen
		app.doScript(fussZuEnd, ScriptLanguage.JAVASCRIPT, _dok, UndoModes.ENTIRE_SCRIPT, "Marginalie erstellen"); 		
	} 
	else {
		fussZuEnd(_dok);
	}
	_dok.viewPreferences.rulerOrigin =_rulerOrigin;		
	_dok.zeroPoint = _zeroPoint;
} else {
	alert ("Kein Dokument geöffnet!")
}

// Wandelt Fußnoten in statische Endnoten 
function fussZuEnd (_dok) {
	var _tf = addPageTextFrame(_dok.pages[-1]);
	_tf.contents = "Endnoten"
	_allFootN = _dok.stories.everyItem().footnotes.everyItem().getElements();
	for (var j = 0; j < _allFootN.length; j++) {
		var _footN = _allFootN[j];
		_tf.insertionPoints[-1].contents = "\r";
		var _endN = _footN.texts[0].move (LocationOptions.AFTER, _tf.paragraphs[-1]);
		_endN.appliedParagraphStyle = "Endnote";
	} 
	app.findGrepPreferences = NothingEnum.NOTHING;
	app.changeGrepPreferences = NothingEnum.NOTHING;
	app.findChangeGrepOptions.includeFootnotes = true;
	app.findGrepPreferences.findWhat = "~F\\t?";
	_dok.changeGrep();
	app.findGrepPreferences = NothingEnum.NOTHING
	app.changeGrepPreferences = NothingEnum.NOTHING;		
}


// Fügt eine neue Seite mit einen Textrahmen in der Größe des Satzspiegels hinzu
function addPageTextFrame(_page, _master) {
	var _dok = _page.parent.parent;
	var _newPage = _dok.pages.add(LocationOptions.AFTER, _page);
	if (_master == undefined) _newPage.appliedMaster = _page.appliedMaster;
	else _newPage.appliedMaster = _master;
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
	return _tf;
}