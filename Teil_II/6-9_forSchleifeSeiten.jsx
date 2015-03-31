#target InDesign
var _dok = app.activeDocument;
_dok.viewPreferences.rulerOrigin = RulerOrigin.PAGE_ORIGIN; //Lineal umstellen
for (var i = 0; i < _dok.pages.length; i++) {
	var _page = _dok.pages[i];
	var _tf = _page.textFrames.add();
	_tf.geometricBounds = [10,10,20,20];
	_tf.contents = _page.name + "";
}