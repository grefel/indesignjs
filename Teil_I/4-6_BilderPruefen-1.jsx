var _dok = app.activeDocument;
var _alleBilder = _dok.allGraphics;
for (var i = 0; i < _alleBilder.length; i++) {
	var _bild = _alleBilder[i];
	var _bildRahmen = _bild.parent;
	if (_bild.geometricBounds[0] > _bildRahmen.geometricBounds[0]) {
		alert ("Vertikaler Versatz oben bei " + _bild.itemLink.name);
	}
	if (_bild.geometricBounds[1] > _bildRahmen.geometricBounds[1]) {
		alert ("Horizontaler Versatz links bei " + _bild.itemLink.name);
	}
	if (_bild.geometricBounds[2] < _bildRahmen.geometricBounds[2]) {
		alert ("Vertikaler Versatz unten bei " + _bild.itemLink.name);
	}
	if (_bild.geometricBounds[3] < _bildRahmen.geometricBounds[3]) {
		alert ("Horizontaler Versatz rechts bei " + _bild.itemLink.name);
	}
}