// metaDataOfLinks.jsx
//DESCRIPTION: Catches MetaData of linked images and creates a report at the Desktop.
// Martin Fischer 10/2008


var myLinkXmpArray = ["author", "copyrightInfoURL", "copyrightNotice", "copyrightStatus", "creationDate", "creator", "description", "documentTitle", "format", "jobName", "keywords", "modificationDate", "serverURL"];

var myIPTCArray = ["CiAdrCity", "CiAdrCtry", "CiAdrExtadr", "CiAdrPcode", "CiAdrRegion", "CiEmailWork", "CiTelWork", "City", "CiUrlWork", "CopyrightNotice", "Country", "CountryCode", "Creator", "CreatorContactInfo", "CreatorJobtitle", "DateCreated", "Description", "DescriptionWriter", "Headline", "Instructions", "IntellectualGenre", "JobID", "Keywords", "Location", "Provider", "Province-State", "RightsUsageTerms", "Scene", "Source", "SubjectCode", "Title"];

var myPSArray = ["photoshop:AuthorsPosition", "photoshop:CaptionWriter", "photoshop:Category", "photoshop:City", "photoshop:Country", "photoshop:Credit", "photoshop:DateCreated", "photoshop:Headline", "photoshop:Instructions", "photoshop:Source", "photoshop:State", "photoshop:SupplementalCategories", "photoshop:TransmissionReference", "photoshop:Urgency"];//var myPSArray = ["photoshop:AuthorsPosition", "CaptionWriter", "Category", "City", "Country", "Credit", "DateCreated", "Headline", "Instructions", "Source", "State", "SupplementalCategories", "TransmissionReference", "Urgency"];

var myTiffArray = ["tiff:ImageWidth", "tiff:ImageLength", "tiff:BitsPerSample", "tiff:Compression", "tiff:PhotometricInterpretation", "tiff:Orientation", "tiff:SamplesPerPixel", "tiff:PlanarConfiguration", "tiff:YCbCrSubSampling", "tiff:YCbCrPositioning", "tiff:XResolution", "tiff:YResolution", "tiff:ResolutionUnit", "tiff:TransferFunction", "tiff:WhitePoint", "tiff:PrimaryChromaticities", "tiff:YCbCrCoefficients", "tiff:ReferenceBlackWhite", "tiff:DateTime", "tiff:ImageDescription", "tiff:MakeProperName", "tiff:Model", "tiff:Software", "tiff:Artist", "tiff:Copyright"];

var myExifArray = ["exif:ExifVersion", "exif:FlashpixVersion", "exif:ColorSpace", "exif:ComponentsConfiguration", "exif:CompressedBitsPerPixel", "exif:PixelXDimension", "exif:PixelYDimension", "exif:UserComment", "exif:RelatedSoundFile", "exif:DateTimeOriginal", "exif:DateTimeDigitized", "exif:ExposureTime", "exif:FNumber", "exif:ExposureProgram", "exif:SpectralSensitivity", "exif:ISOSpeedRatings", "exif:OECF", "exif:ShutterSpeedValue", "exif:ApertureValue", "exif:BrightnessValue", "exif:ExposureBiasValue", "exif:MaxApertureValue", "exif:SubjectDistance", "exif:MeteringMode", "exif:LightSource", "exif:Flash", "exif:FocalLength", "exif:SubjectArea", "exif:FlashEnergy", "exif:SpatialFrequencyResponse", "exif:FocalPlaneXResolution", "exif:FocalPlaneYResolution", "exif:FocalPlaneResolutionUnit", "exif:SubjectLocation", "exif:ExposureIndex", "exif:SensingMethod", "exif:FileSource", "exif:SceneType", "exif:CFAPattern", "exif:CustomRendered", "exif:ExposureMode", "exif:WhiteBalance", "exif:DigitalZoomRatio", "exif:FocalLengthIn35mmFilm", "exif:SceneCaptureType", "exif:GainControl", "exif:Contrast", "exif:Saturation", "exif:Sharpness", "exif:DeviceSettingDescription", "exif:SubjectDistanceRange", "exif:ImageUniqueID", "exif:GPSVersionID", "exif:GPSLatitude", "exif:GPSLongitude", "exif:GPSAltitudeRef", "exif:GPSAltitude", "exif:GPSTimeStamp", "exif:DateTimeOriginal,", "exif:DateTimeDigitized.", "exif:GPSTimeStamp", "exif:GPSSatellites", "exif:GPSStatus", "exif:GPSMeasureMode", "exif:GPSDOP", "exif:GPSSpeedRef", "exif:GPSSpeed", "exif:GPSTrackRef", "exif:GPSTrack", "exif:GPSImgDirectionRef", "exif:GPSImgDirection", "exif:GPSMapDatum", "exif:GPSDestLatitude", "exif:GPSDestLongitude", "exif:GPSDestBearingRef", "exif:GPSDestBearing", "exif:GPSDestDistanceRef", "exif:GPSDestDistance", "exif:GPSProcessingMethod", "exif:GPSAreaInformation"];

var myCameraRawArray = ["crs:AutoBrightness", "crs:AutoContrast", "crs:AutoExposure", "crs:AutoShadows", "crs:BlueHue", "crs:BlueSaturation", "crs:Brightness", "crs:CameraProfile", "crs:ChromaticAberrationB", "crs:ChromaticAberrationR", "crs:ColorNoiseReduction", "crs:Contrast", "crs:CropTop", "crs:CropLeft", "crs:CropBottom", "crs:CropRight", "crs:CropAngle", "crs:CropWidth", "crs:CropHeight", "crs:CropUnits", "crs:Exposure", "crs:GreenHue", "crs:GreenSaturation", "crs:HasCrop", "crs:HasSettings", "crs:LuminanceSmoothing", "crs:RawFileName", "crs:RedHue", "crs:RedSaturation", "crs:Saturation", "crs:Shadows", "crs:ShadowTint", "crs:Sharpness", "crs:Temperature", "crs:Tint", "crs:ToneCurve", "crs:ToneCurveName", "crs:Version", "crs:VignetteAmount", "crs:VignetteMidpoint", "crs:WhiteBalance"];



var myInfo = new Array;
var myDoc = app.activeDocument; 
var myLinks = app.documents[0].links;



for ( i = 0; i < myLinks.length; i++) {
	getMetaData ( myLinks[i] );
}

writeData ( 'Metadaten zu ' + myDoc.name + '\r-----------\r\r' + myInfo.join ( '\r\r'), File ('~/Desktop/Metadaten_' + myDoc.name.replace(/.indd$/, '') + '.txt'));


// Funktionen 
function getMetaData ( aLink ) {
	var myLinkXmp = aLink.linkXmp.properties.toSource().replace( /^\(\{/,'' ).replace (/\)\}$/,'').replace( /parent.+$/,'').replace(/:/g, ':\t').split( ', '); 
	var myString = aLink.name; 
	myString += loopLinkXmp ( aLink, myLinkXmpArray );
	myString += loopArray ( aLink, "http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/", "Iptc4xmpCore:CreatorContactInfo/Iptc4xmpCore:", myIPTCArray);
	myString += loopArray ( aLink, "http://ns.adobe.com/photoshop/1.0/", "", myPSArray );
	myString += loopArray ( aLink, "http://ns.adobe.com/tiff/1.0/", "", myTiffArray );
	myString += loopArray ( aLink, "http://ns.adobe.com/exif/1.0/", "", myExifArray );
	myString += loopArray ( aLink, "http://ns.adobe.com/camera-raw-settings/1.0/", "", myCameraRawArray );
	myInfo.push( myString.replace( /, $/,'') );
}



function loopArray( aLink, s1, s2, anArray ) { 
	var temp = '\r\t--- ' + s1 + ' ---\r\t';
	for ( var a = 0; a < anArray.length; a++) {
		try {
			var theEvalString = 'aLink.linkXmp.getProperty(\"' + s1 + '\", \"' + s2 + anArray[a] + '\")';
			var myCode = eval( theEvalString );
			if ( myCode != '' ) temp += '[' + anArray[a] + ']\t' + myCode + '\r\t'; 
		} catch (e){ 
			//temp +=e + '\r' 
		}
	}
	return temp;
}


function loopLinkXmp( aLink, anArray ) {
	var temp = '\r\t--- LinkMetadata ---\r\t';
	for ( var a = 0; a < anArray.length; a++) {
		try {
			var theEvalString = 'aLink.linkXmp.' + anArray[a] ;
			var myCode = eval( theEvalString );
			if ( myCode != '' ) temp += '[' + anArray[a] + ']\t' + myCode + '\r\t'; 
		} catch (e){ 
			//temp +=e + '\r'
		}
	}
	return temp;
}



function writeData ( aData, theFile ) { 
	theFile.open ( 'w', 'Text', 'R*ch' ); 
	theFile.encoding = 'UTF-8'; 
	theFile.write ( aData ); 
	theFile.close (); 
}
