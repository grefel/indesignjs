var _dok = app.activeDocument;
if (!_dok.swatches.itemByName("Rot").isValid ) {
	var _farbFeld = _dok.colors.add();
	_farbFeld.name = "Rot";
	_farbFeld.model = ColorModel.PROCESS;
	_farbFeld.space = ColorSpace.CMYK;
	_farbFeld.colorValue = [0,100,100,0];
} 
var _tf = _dok.textFrames.add(_dok.layers[0], undefined, undefined, {geometricBounds:[10,10,100,100],fillColor:"Rot"});
var _table = _tf.tables.add();
_table.columns.add(LocationOptions.BEFORE, _table.columns[1]);
