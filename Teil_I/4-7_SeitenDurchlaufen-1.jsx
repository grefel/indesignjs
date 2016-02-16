var _dok = app.activeDocument;
var _alleSeiten = _dok.pages;
for (var i = 0; i < _alleSeiten.length; i++) {
	var _seite = _alleSeiten[i];
	if (_seite.textFrames.length > 0) {
		var _tf = _seite.textFrames[0];
		if (_tf.paragraphs[0].appliedParagraphStyle.name == "u1") {
			_seite.appliedMaster = _dok.masterSpreads.itemByName("k-kapitelstart"); 
		}
	}
}