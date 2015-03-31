#target InDesign
var _tf = app.selection[0];
_tf.insertionPoints[0].contents = "Hallo ";
_tf.words[0].insertionPoints[-1].contents = " Welt";