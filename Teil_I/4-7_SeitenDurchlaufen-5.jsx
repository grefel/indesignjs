#target InDesign
var _dok = app.activeDocument;
var _alleSeiten = _dok.pages;
for (var i = 0; i < _alleSeiten.length; i++) {
	var _seite = _alleSeiten[i];
	var _tf = _seite.textFrames.itemByName("haupttext");
	if (_tf != null ) {		
		var _ersterAbsatz = _tf.paragraphs[0];
		if (_ersterAbsatz .appliedParagraphStyle.name == "u1") {
			_seite.appliedMaster = _dok.masterSpreads.itemByName("k-kapitelstart"); 
			_tf.paragraphs.nextItem(_ersterAbsatz ).appliedParagraphStyle = "grundschrift_ohne_einzug";
		}
		if (_tf.lines.length < 17) {
			var _musterSeiten = _dok.masterSpreads.itemByName("n-normal");
			if (_seite.side == PageSideOptions.RIGHT_HAND) {
				var _seitenzahlTF = _musterSeiten.pages[1].textFrames.itemByName("seitenzahl");
			}
			else {
				var _seitenzahlTF = _musterSeiten.pages[0].textFrames.itemByName("seitenzahl");
			}
			var _geloesterTF = _seitenzahlTF.override(_seite);
			_geloesterTF.remove();			
		 }
	}
}