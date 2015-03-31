#target InDesign
var _REbreak = RegExp("\\r","g");
var _RELastParEmpty = RegExp("^\\uFEFF*\\r");

app.findGrepPreferences = NothingEnum.nothing;
app.findGrepPreferences.findWhat = "\\s{2,}";
var _results = app.activeDocument.findGrep (true);

for (var i = 0; i < _results.length ; i++) {
	var _res = _results[i];
	// Je weiter unten das Zeichen in der folgenden Liste steht, desto höher ist die Priorität :
	// Normal Space
	if (_res.contents.indexOf ("\u0020") > -1) _mostImportant = _res.contents.indexOf ("\u0020"); 
	// Nonbreaking Space
	if (_res.contents.indexOf ("\u00A0") > -1) _mostImportant = _res.contents.indexOf ("\u00A0"); 
	// Nonbreaking Space fixed With
	if (_res.contents.indexOf ("\u202F") > -1) _mostImportant = _res.contents.indexOf ("\u202F"); 
	// Punctuation Space
	if (_res.contents.indexOf ("\u2008") > -1) _mostImportant = _res.contents.indexOf ("\u2008"); 
	// Figure Space
	if (_res.contents.indexOf ("\u2007") > -1) _mostImportant = _res.contents.indexOf ("\u2007"); 
	// Flush Space
	if (_res.contents.indexOf ("\u2001") > -1) _mostImportant = _res.contents.indexOf ("\u2001"); 
	// Hair Space
	if (_res.contents.indexOf ("\u200A") > -1) _mostImportant = _res.contents.indexOf ("\u200A");
	// Thin Space
	if (_res.contents.indexOf ("\u2009") > -1) _mostImportant = _res.contents.indexOf ("\u2009");
	// Sixth Space
	if (_res.contents.indexOf ("\u2006") > -1) _mostImportant = _res.contents.indexOf ("\u2006");
	// Quarter Space
	if (_res.contents.indexOf ("\u2005") > -1) _mostImportant = _res.contents.indexOf ("\u2005");
	// Third Space
	if (_res.contents.indexOf ("\u2004") > -1) _mostImportant = _res.contents.indexOf ("\u2004");
	// EN Space
	if (_res.contents.indexOf ("\u2002") > -1) _mostImportant = _res.contents.indexOf ("\u2002");
	// EM Space
	if (_res.contents.indexOf ("\u2003") > -1) _mostImportant = _res.contents.indexOf ("\u2003");
	// Tabulator
	if (_res.contents.indexOf ("\t") > -1) _mostImportant = _res.contents.indexOf ("\t");
	// Line Break 
	if (_res.contents.indexOf ("\n") > -1) _mostImportant = _res.contents.indexOf ("\n");
	// All Other Breaks
	if (_res.contents.indexOf ("\r") > -1) _mostImportant = _res.contents.indexOf ("\r");
	
	var _savedPStyle = false;
	var _isPar = _res.contents.match (_REbreak);
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

	var _resChars = _res.characters.everyItem().getElements();
	for (var k = _resChars.length -1; k >= 0; k--) {
		var _char = _resChars[k];
		if ( _char.contents != "\uFEFF" && 
			_char.contents != SpecialCharacters.END_NESTED_STYLE &&
			_char.contents != SpecialCharacters.INDENT_HERE_TAB &&
			_char.contents != SpecialCharacters.DISCRETIONARY_HYPHEN &&
			_char.contents != SpecialCharacters.DISCRETIONARY_LINE_BREAK &&
			_char.contents != SpecialCharacters.ZERO_WIDTH_NONJOINER &&
			_char.contents != SpecialCharacters.ZERO_WIDTH_JOINER &&
			k != _mostImportant) _char.remove ();
	}

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