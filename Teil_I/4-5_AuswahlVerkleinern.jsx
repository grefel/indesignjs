#target InDesign
var _auswahl = app.selection[0];
var _schriftG = _auswahl.characters[0].pointSize;
var _kleinsterBuchstabe = _schriftG * 0.4; // 40 Prozent
var _laenge = _auswahl.characters.length;
var _schrittWeite = (_schriftG - _kleinsterBuchstabe) / _laenge;
for (var i = 1; i < _auswahl.characters.length; i++) {
	var _buchstabe = _auswahl.characters[i];
	_aktuellerAbzug = _schrittWeite * i;
	_buchstabe.pointSize = _schriftG - _aktuellerAbzug;
}