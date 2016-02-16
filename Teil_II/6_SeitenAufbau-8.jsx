main();
function main() {
	if (app.documents.length > 0) {
		var  _dok = app.activeDocument;
	} else {
		alert ("Es ist kein Dokument geöffnet")
		return;
	}
	_dok.viewPreferences.rulerOrigin = RulerOrigin.PAGE_ORIGIN;
	with (_dok.documentPreferences) {
		pageHeight = 210;
		pageWidth = 148;
	}
	while (_dok.pages.length < 32) {
		_dok.pages.add();
	}
	var _seitenzahlen = ["eins","zwei","drei","vier","fünf","sechs","sieben","acht","neun","zehn","elf","zwölf","dreizehn","vierzehn","fünfzehn","sechzehn","siebzehn","achtzehn","neunzehn","zwanzig","einundzwanzig","zweiundzwanzig","dreiundzwanzig","vierundzwanzig","fünfundzwanzig","sechsundzwanzig","siebenundzwanzig","achtundzwanzig","neunundzwanzig","dreißig","einunddreißig","zweiunddreißig"]
	for (var i = 0; i < _dok.pages.length; i++) {
		nummeriereSeite(_dok.pages[i], _seitenzahlen[i]);
	}
}
function nummeriereSeite(_page, _seitenzahl) {
	_tf = _page.textFrames.add();
	_tf.visibleBounds = [12.7,12.7,30,135.3];
	_tf.contents = _seitenzahl;
}