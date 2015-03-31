#target InDesign
var _dok = app.activeDocument;
var _textAbschnitte = _dok.stories;
for (var k = 0; k < _textAbschnitte.length; k++) {
	var _textAbschnitt = _textAbschnitte[k];
	var _textBereiche = _textAbschnitt.textStyleRanges;
	for (var i = 0; i < _textBereiche.length; i++) {
		var _textBereich = _textBereiche[i];
		_textBereich.pointSize = _textBereich.pointSize * 1.1;
	}
}