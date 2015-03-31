var _namenArray = ["Anna", "Bastian", "Christian"];

alert (_namenArray[0]); //Anna

var _laenge = _namenArray.length;
alert (_namenArray[_laenge -1]); //Christian

_namenArray.push("Aaron am Ende"); 
var _laenge = _namenArray.length;
alert (_namenArray[_laenge -1]); //Aaron am Ende

_namenArray.unshift ("Tobias am Anfang");
alert (_namenArray[0]); //Tobias am Anfang

// Zweites Element ("Anna") löschen:
_namenArray.splice(1,1);
alert (_namenArray[1]); //Bastian
// Element an zweiter Stelle hinzufügen
_namenArray.splice(1,0,"Bob");
alert (_namenArray[1]); //Bob

var _alleWerteString = _namenArray.join("\r");
alert(_alleWerteString); // Tobias am Anfang,Bob,Bastian,Christian,Aaron am Ende

_namenArray.sort();
var _alleWerteString = _namenArray.join("\r");
alert(_alleWerteString); // Nach der Sortierung: Aaron am Ende,Bastian,Bob,Christian,Tobias am Anfang






