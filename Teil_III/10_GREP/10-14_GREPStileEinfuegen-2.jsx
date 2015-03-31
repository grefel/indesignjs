#target InDesign
var _dok = app.activeDocument;
var _absFormate = _dok.allParagraphStyles;
for (var i = 1; i < _absFormate.length; i++) {
	var _format = _absFormate[i].nestedGrepStyles.add();
	_format.grepExpression = "\\d";
	_format.appliedCharacterStyle = getCharacterStyle("ziffer");
}

function getCharacterStyle (_name) {
	for (var i = 0; i < _dok.allCharacterStyles.length; i++) {
		if (_dok.allCharacterStyles[i].name == _name ) return _dok.allCharacterStyles[i];
	}
	return null;
}