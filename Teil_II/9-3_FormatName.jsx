var dok = app.activeDocument;
var formatName = "FormatName";
var format = dok.paragraphStyles.itemByName(formatName);
if (!format.isValid )  format = dok.paragraphStyles.add({name:formatName});
