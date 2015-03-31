// Teil 1
var _datei = File("~/Desktop/6-12_Test.csv");
if (_datei.open("r")) {
	var _array = [];
	do{
		var _zeile = _datei.readln();
		_array.push(_zeile)
	} while (_datei.eof == false);
	_datei.close();
} else {
	alert ("Bitte kopieren Sie die Datei '6-12_Test.csv' auf ihren Desktop.");
	exit(0);
}
alert(_array.join("\r"));
// Teil 2
_array.sort();
var _dateiNeu = File("~/Desktop/6-12_TestSortiert.csv");
if (_dateiNeu.open("w")) {
	for (var i =0; i < _array.length; i++) {
		_dateiNeu.writeln(_array[i]);
	}
	_dateiNeu.close(); 
} else {
	alert("Kann die Datei nicht zum schreiben öffnen!")
}
