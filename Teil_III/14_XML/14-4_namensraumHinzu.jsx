function addStandardNameSpace(xmlElement) {
	if( !xmlElement.xmlAttributes.itemByName("xmlns:xml").isValid ) {
		xmlElement.xmlAttributes.add( "xmlns:xml", "http://www.w3.org/XML/1998/namespace" );
	}
	if( !xmlElement.xmlAttributes.itemByName("xmlns:aid").isValid ) {
		xmlElement.xmlAttributes.add( "xmlns:aid", "http://ns.adobe.com/AdobeInDesign/4.0/");
	}
	if( !xmlElement.xmlAttributes.itemByName("xmlns:aid5").isValid ) {
		xmlElement.xmlAttributes.add( "xmlns:aid5", "http://ns.adobe.com/AdobeInDesign/5.0/");
	}
	return xmlElement;
}
