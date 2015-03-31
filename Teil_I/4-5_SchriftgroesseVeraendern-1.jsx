#target InDesign
var _dok = app.activeDocument;
var _textAbschnitt = _dok.stories[0];
var _textBereiche = _textAbschnitt.textStyleRanges;
for (var i = 0; i < _textBereiche.length; i++) {
	var _textBereich = _textBereiche[i];
	_textBereich.pointSize = _textBereich.pointSize * 1.1;
}