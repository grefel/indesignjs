var _dok = app.activeDocument;
var _absFormate = _dok.allParagraphStyles;
for (var i = 1; i < _absFormate.length; i++) {
	var _gs = _absFormate[i].nestedGrepStyles.add();
	_gs.grepExpression = "\\d";
	_gs.appliedCharacterStyle = _dok.characterStyles.itemByName("ziffer");
}