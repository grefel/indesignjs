var _dok = app.documents.add();
_dok = app.documents.add();
_dok.pages.add();
_dok.pages.add();
_dok.pages.add();
for (var i = 0; i < _dok.pages.length; i++) {
	var _tf = _dok.pages[i].textFrames.add();
	_tf.contents = i+"";
}

