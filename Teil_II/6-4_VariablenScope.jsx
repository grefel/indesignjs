if (true) {
	var _nameBlock = "Miriam";
}
alert (_nameBlock ); // Die Variable _nameBlock ist auch außerhalb des Block-Scopes definiert.

var _name = "Max";

funktion (); // Aufruf der Funktion in Zeile 11

alert (_nameLocal); // Hier kann NICHT auf die lokale Variable _nameLocal zugegriffen werden.

function funktion() {
	alert (_name); // Die Variable _name ist global und kann innerhalb der Funktion "funktion" verwendet werden.
	var _nameLocal = "Moritz";
}

