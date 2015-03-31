var _ausw = app.selection[0];
var _hoehe = _ausw.geometricBounds[2] - _ausw.geometricBounds[0];
var _breite = _ausw.geometricBounds[3] - _ausw.geometricBounds[1];
alert ("Das ausgewählte Objekt hat die Höhe " +_hoehe.toFixed(2) + " und Breite " + _breite.toFixed(2));
// Mit der Methode .toFixed() kann man eine Zahl auf eine bestimmte Anzahl Nachkommastellen runden.