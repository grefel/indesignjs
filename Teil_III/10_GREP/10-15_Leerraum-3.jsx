#target InDesign
var _REbreak = RegExp("\\r","g");
var _RELastParEmpty = RegExp("^\\uFEFF*\\r");

app.findGrepPreferences = NothingEnum.nothing;
app.findGrepPreferences.findWhat = "\\s{2,}";
var _results = app.activeDocument.findGrep (true);	

for (var i = 0; i < _results.length ; i++) {
	var _res = _results[i];
	// Die Priorität der Zeichen entspricht der Reihenfolge im Array. Das letzte Zeichen ist das Wichtigste
	var _spaces = ["\u0020","\u00A0","\u202F","\u2008","\u2007","\u2001","\u200A","\u2009","\u2006","\u2005","\u2004","\u2002","\u2003","\t","\n","\r"];
	for (var k =0; k < _spaces.length; k++) {
		var _important = _res.contents.indexOf (_spaces[k]);
		if (_important > -1) _mostImportant = _important;
	}
	// Absatzformat sichern
	var _savedPStyle = false;
	var _isPar= _res.contents.match (_REbreak);
	if (_isPar != null && _isPar.length > 1) {
		_lastPar = _res.paragraphs[-1];
		if (_RELastParEmpty.test (_lastPar.contents) ) {
			_par = nextParagraph(_lastPar);
			if (_par != null) _savedPStyle = _par.appliedParagraphStyle;
		}
		else {
			_savedPStyle =_lastPar.appliedParagraphStyle;
		}
	}

	// Alle nicht benötigten Zeichen löschen. Erhalten bleiben bei der Suche ignnorierte Zeichen und das Zeichen das am Index des oben ermittelten wichtigsten Zeichen steht
	var _resChars = _res.characters.everyItem().getElements();
	for (var k = _resChars.length -1; k >= 0; k--) {
		var _char = _resChars[k];
		if ( _char.contents != "\uFEFF" && 
			_char.contents != SpecialCharacters.END_NESTED_STYLE &&
			_char.contents != SpecialCharacters.INDENT_HERE_TAB &&
			_char.contents != SpecialCharacters.DISCRETIONARY_HYPHEN &&
			_char.contents != SpecialCharacters.DISCRETIONARY_LINE_BREAK &&
			_char.contents != SpecialCharacters.ZERO_WIDTH_NONJOINER &&
			_char.contents != "\u200D" &&
			 k != _mostImportant) _char.remove ();
	}
	// Die Absatzformatvorlage wird erneut zugewiesen
	if (_savedPStyle != false) {
		var _par = nextParagraph(_char.paragraphs[0]);
		_par.appliedParagraphStyle = _savedPStyle;
	}
}


// Optimiert die Funktion nextItem() der Sammlung Paragraphs, Dieser Ansatz liefert bei großen Textmengen deutlich schneller den nächsten Absatz als nextItem()
function nextParagraph(_par) {
	var _lastCharLetzterIndex = _par.characters[-1].index;
	var _firstCharNaechster = _par.parentStory.characters[_lastCharLetzterIndex + 1];
	if (_firstCharNaechster != null ) return _firstCharNaechster.paragraphs[0]
	else return null;
}