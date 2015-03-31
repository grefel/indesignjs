var _dok = app.activeDocument;
_dok.viewPreferences.rulerOrigin = RulerOrigin.PAGE_ORIGIN;
with (_dok.documentPreferences) {
	pageHeight = 210;
	pageWidth = 148;
}
var _tf = _dok.pages[0].textFrames.add();
_tf.visibleBounds = [12.7,12.7,30,135.3];
_tf.contents = "Seite " + 1;

