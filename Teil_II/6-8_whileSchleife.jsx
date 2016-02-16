var _tf = app.selection[0];
while (_tf.overflows) {
	var _bounds = _tf.visibleBounds;
	_tf.visibleBounds = [_bounds[0],_bounds[1],_bounds[2] + 1,_bounds[3]];
}