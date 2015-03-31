var _dok = app.documents.add()
var _tf = _dok.textFrames.add();
_tf.geometricBounds = [0,0,_dok.documentPreferences.pageHeight,_dok.documentPreferences.pageWidth];
_tf.textFramePreferences.verticalJustification = VerticalJustification.CENTER_ALIGN;
_tf.contents = "Herzlich Willkommen!\nIch wünsche viel Erfolg mit dem Buch\rGregor Fellenz";
_tf.paragraphs.everyItem().justification = Justification.CENTER_ALIGN;
_tf.paragraphs[0].pointSize = 24;
_tf.paragraphs[0].spaceAfter = "5mm";
