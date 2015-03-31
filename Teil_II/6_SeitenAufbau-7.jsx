var _seitenzahlen = ["eins","zwei","drei","vier","fünf","sechs","sieben","acht","neun","zehn","elf","zwölf","dreizehn","vierzehn","fünfzehn","sechzehn","siebzehn","achtzehn","neunzehn","zwanzig","einundzwanzig","zweiundzwanzig","dreiundzwanzig","vierundzwanzig","fünfundzwanzig","sechsundzwanzig","siebenundzwanzig","achtundzwanzig","neunundzwanzig","dreißig","einunddreißig","zweiunddreißig"]
var _dok;
if (app.documents.length > 0) {
	_dok = app.activeDocument;
} else {
	_dok = app.documents.add();
}
_dok.viewPreferences.rulerOrigin = RulerOrigin.PAGE_ORIGIN;
with (_dok.documentPreferences) {
	pageHeight = 210;
	pageWidth = 148;
}
while (_dok.pages.length < 32) {
	_dok.pages.add();
}
var _page, _tf;
for (var i = 0; i < _dok.pages.length; i++) {
	_page = _dok.pages[i];
	_tf = _page.textFrames.add();
	_tf.visibleBounds = [12.7,12.7,30,135.3];
	_tf.contents = _seitenzahlen[i];
}