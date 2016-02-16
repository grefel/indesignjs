<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:output indent="no"/>
    <!-- Copy all    -->
    <xsl:template match="@*|node()">
        <xsl:copy>
            <xsl:apply-templates select="@*|node()"/>
        </xsl:copy>
    </xsl:template>

    <!-- Das Dokument wird vom Root-Element neu aufgebaut   -->
	<xsl:template match="kochbuch">
		<xsl:element name="kochbuch">
			<xsl:copy-of select="@*"/>
			<xsl:apply-templates select="*"/>
		</xsl:element>
    </xsl:template>
	
	<!-- Elemente die keine Leerraum enthalten -->
	<xsl:template match="rezept">
		<xsl:element name="rezept">
			<!-- Attribute kopieren -->
			<xsl:copy-of select="@*"/>
			<xsl:apply-templates select="*"/>
		</xsl:element>
	</xsl:template>
	<xsl:template match="zutaten">
		<xsl:element name="zutaten">
			<!-- Attribute kopieren -->
			<xsl:copy-of select="@*"/>
			<xsl:apply-templates select="*"/>
		</xsl:element>
	</xsl:template>

	
    <!-- Titel formatieren und Umbruch einfügen   -->
    <xsl:template match="titel">
        <!-- Element Title kopieren -->
        <xsl:copy>
            <xsl:apply-templates/>
            <!--  Return einfügen -->
        </xsl:copy>
        <xsl:text>&#x0a;</xsl:text>
        <xsl:element name="u-zwischen">
            <xsl:text>Zutaten</xsl:text>
        </xsl:element>
        <xsl:text>&#x0a;</xsl:text>
    </xsl:template>

    <xsl:template match="menge">
        <xsl:copy>
            <xsl:apply-templates/>
            <!-- Tabulator einfügen -->
        </xsl:copy>
        <xsl:text>&#x09;</xsl:text>
    </xsl:template>

    <xsl:template match="zutat">
    	<xsl:element name="zutat">
    		<!-- Attribute kopieren -->
    		<xsl:copy-of select="@*"/>
    		<xsl:apply-templates select="*"/>
    	</xsl:element>
    	<xsl:text>&#x0a;</xsl:text>
    </xsl:template>

    <xsl:template match="beschreibung">
        <xsl:element name="u-zwischen">
            <xsl:text>Beschreibung</xsl:text>
        </xsl:element>
        <xsl:text>&#x0a;</xsl:text>
    	<xsl:element name="beschreibung">
    		<!-- Attribute kopieren -->
    		<xsl:copy-of select="@*"/>
    		<xsl:apply-templates select="*"/>
    	</xsl:element>
    </xsl:template>

    <xsl:template match="schritt">
    	<xsl:element name="schritt">
    		<!-- Attribute kopieren -->
    		<xsl:copy-of select="@*"/>
    		<xsl:apply-templates/>
    	</xsl:element>
    	<xsl:text>&#x0a;</xsl:text>
    </xsl:template>
    

    <xsl:template match="bild">
        <xsl:copy>
        <xsl:copy-of select="@href"/>
            <xsl:apply-templates/>
        </xsl:copy>
        <xsl:text>&#x0a;</xsl:text>
    </xsl:template>        

    <xsl:template match="bild-container">
    	<xsl:element name="bild-container">
    		<!-- Attribute kopieren -->
    		<xsl:copy-of select="@*"/>
    		<xsl:apply-templates select="*"/>
    	</xsl:element>
    </xsl:template>
    
</xsl:stylesheet>
