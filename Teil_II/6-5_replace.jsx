var _string = "Ein Beispieltext mit der Ziffern 65 und 75";
var _ergebnis = _string.replace("Beispieltext", "Beispiel");
_ergebnis = _string.replace(/\d+/g, "[$0]");
alert (_ergebnis);