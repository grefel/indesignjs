#target InDesign
for (var i =0; i < app.activeDocument.textFrames.length; i++) {
	var _tf = app.activeDocument.textFrames[i];
	if (_tf.overflows == true) {
		_tf.select();
		break;
	}
}