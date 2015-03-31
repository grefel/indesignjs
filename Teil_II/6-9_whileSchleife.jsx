#target InDesign
var _tf = app.selection[0];
while (_tf.overflows) {
	var _bounds = _tf.geometricBounds;
	_tf.geometricBounds = [_bounds[0],_bounds[1],_bounds[2] + 1,_bounds[3]];
}