var _dok = app.activeDocument;
var _alleBilder = _dok.allGraphics;
for (var i = 0; i < _alleBilder.length; i++) {
	var _bild = _alleBilder[i];
	var _bildRahmen = _bild.parent;
	var _fehler = false;
	var _fehlerMeldung = "";
	if (_bild.geometricBounds[0] > _bildRahmen.geometricBounds[0]) {
		_fehlerMeldung= _fehlerMeldung + "Vertikaler Versatz oben\n";
		_fehler = true;
	}
	if (_bild.geometricBounds[1] > _bildRahmen.geometricBounds[1]) {
		_fehlerMeldung= _fehlerMeldung + "Horizontaler Versatz links\n";
		_fehler = true;
	}
	if (_bild.geometricBounds[2] < _bildRahmen.geometricBounds[2]) {
		_fehlerMeldung = _fehlerMeldung + "Vertikaler Versatz unten\n";
		_fehler = true;
	} 
	if (_bild.geometricBounds[3] < _bildRahmen.geometricBounds[3]) {
		_fehlerMeldung= _fehlerMeldung+ "Horizontaler Versatz rechts\n";
		_fehler = true;
	}
	if (_fehler) {
		app.select(_bildRahmen);
		app.activeWindow.zoom(ZoomOptions.FIT_PAGE);
		alert (_bild.itemLink.name + "\n" + _fehlerMeldung);
		break;
	}
}