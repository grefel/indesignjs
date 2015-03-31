#target InDesign
if (app.documents.length > 0 && app.selection.length > 0 && app.selection[0].hasOwnProperty ("baseline") && app.selection[0].constructor.name != "InsertionPoint") { 
	if (app.scriptPreferences.version >= 6 ) { // Ab CS4 Undo bereitstellen
		app.doScript(createInlineText, ScriptLanguage.JAVASCRIPT , [], UndoModes.ENTIRE_SCRIPT, "Marginalie erstellen"); 		
	} 
	else {
		createInlineText();
	}
} else {
	alert ("Bitte positionieren Sie den Cursor im Text!")
}

function createInlineText() {
	var _dok = app.activeDocument;
	var _sel = app.selection[0];
	var _mtf = _sel.insertionPoints[0].textFrames.add();
	if (app.scriptPreferences.version == 5) { //Nur CS3
		_sel = _sel.parentStory.characters.itemByRange (_sel.insertionPoints[1].index,_sel.insertionPoints[-1].index + 1);
	}
	var _breite = 30;
	var _hoehe = 7;
	_mtf.geometricBounds = [0,0,_hoehe,_breite];
	var _res = _sel.move(LocationOptions.AT_BEGINNING, _mtf);
	_mtf.appliedObjectStyle = _dok.objectStyles.itemByName("marginalie");
	_mtf.fit(FitOptions.FRAME_TO_CONTENT);
	_mtf.paragraphs.everyItem().appliedParagraphStyle = _dok.paragraphStyles.itemByName("marginalie");
	var _char = _mtf.parent;
	var _pos = _char.index;
	var _story = _char.parentStory;
	if (_story.characters[_pos -1].contents == " " && _story.characters[_pos +1].contents == " " ) {
		_story.characters[_pos + 1].remove();
	}
}