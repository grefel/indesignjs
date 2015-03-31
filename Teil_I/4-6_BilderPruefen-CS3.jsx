#target InDesign
var _dok = app.activeDocument;
var _alleBilder = _dok.allGraphics;
for (var i = 0; i < _alleBilder.length; i++) {
	var _bild = _alleBilder[i];
	var _bildRahmen = _bild.parent;
	var _fehler = false;
	var _fehlerMeldung = "";
	// Zunächst muss geprüft werden ob es sich um ein Rasterbild handelt, Vektorgrafiken haben keine Auflösung
	if (_bild.constructor.name == "Image") {
		if (_bild.effectivePpi[0] < 200) {
	 	 	_fehlerMeldung = _fehlerMeldung + "Horizontale Auflösung zu gering\n";
	 	 	_fehler = true;
	 	} 
		if (_bild.effectivePpi[1] < 200) {
	 	 	_fehlerMeldung = _fehlerMeldung + "Vertikale Auflösung zu gering\n";
	 	 	_fehler = true;
	 	} 
	 	if (_bild.space == "RGB") {
	 	 	_fehlerMeldung = _fehlerMeldung + "Bild im RGB Modus\n";
	 	 	_fehler = true;
	 	} 
	 } 
	// Falls ein Fehler gefunden wurde, ist in der Variable nicht mehr der leere String gespeichert. 
	if (_fehler) {
		app.activeWindow.activePage = _bildRahmen.parent; // Nur CS3
		app.select(_bildRahmen); 
		app.activeWindow.zoom(ZoomOptions.FIT_PAGE);
		alert (_bild.itemLink.name + "\n" + _fehlerMeldung);
		break;
	}
}