var _dok = app.activeDocument;
var _alleSeiten = _dok.pages;
for (var i = 0; i < _alleSeiten.length; i++) {
	var _seite = _alleSeiten[i];
	var _tf = _seite.textFrames.itemByName("haupttext");
	if (_tf.isValid == true) {
		var _ersterAbsatz = _tf.paragraphs[0];
		if (_ersterAbsatz .appliedParagraphStyle.name == "u1") {
			_seite.appliedMaster = _dok.masterSpreads.itemByName("k-kapitelstart"); 
			_tf.paragraphs.nextItem(_ersterAbsatz ).appliedParagraphStyle = "grundschrift_ohne_einzug";
		}
	}
}