var _seitenzahlen = ["eins","zwei","drei","vier","fünf","sechs","sieben","acht","neun","zehn","elf","zwölf","dreizehn","vierzehn","fünfzehn","sechzehn","siebzehn","achtzehn","neunzehn","zwanzig","einundzwanzig","zweiundzwanzig","dreiundzwanzig","vierundzwanzig","fünfundzwanzig","sechsundzwanzig","siebenundzwanzig","achtundzwanzig","neunundzwanzig","dreißig","einunddreißig","zweiunddreißig"]
alert (_seitenzahlen[0]);
alert (_seitenzahlen[31]);
var _dok;
if (app.documents.length > 0) {
	_dok = app.activeDocument;
} else {
	_dok = app.documents.add();
}
// Ternär: 
// var _dok = (app.documents.length > 0) ? 	_dok = app.activeDocument : _dok = app.documents.add();
_dok.viewPreferences.rulerOrigin = RulerOrigin.PAGE_ORIGIN;
with (_dok.documentPreferences) {
	pageHeight = 210;
	pageWidth = 148;
}
while (_dok.pages.length < 32) {
	_dok.pages.add();
}
var _tf = _dok.pages[0].textFrames.add();
_tf.visibleBounds = [12.7,12.7,30,135.3];
_tf.contents = "Seite " + 1;
