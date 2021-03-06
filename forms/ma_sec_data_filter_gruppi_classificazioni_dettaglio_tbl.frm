dataSource:"db:/ma_framework/sec_filtrigruppiclassificazionidettaglio",
encapsulation:60,
items:[
{
anchors:11,
horizontalAlignment:0,
labelFor:"fld_codice",
location:"0,0",
name:"lbl_codice",
size:"80,20",
styleClass:"table_header",
text:"Codice",
typeid:7,
uuid:"092DADA6-9084-46B6-BB63-A17E07667795"
},
{
anchors:11,
dataProviderID:"sec_filtrigruppiclassificazionidettaglio_to_gruppi_classificazionidettaglio.descrizione",
editable:false,
location:"400,20",
name:"fld_dettaglio",
size:"240,20",
styleClass:"table",
typeid:4,
uuid:"2B6CBC2F-37E8-4743-B5C0-3BF32BC6A759"
},
{
anchors:3,
dataProviderID:"exclude",
displayType:4,
horizontalAlignment:0,
location:"640,20",
name:"fld_exclude",
size:"50,20",
styleClass:"table",
typeid:4,
uuid:"3C715251-DD85-4EEE-922E-89E29094F115"
},
{
anchors:11,
dataProviderID:"sec_filtrigruppiclassificazionidettaglio_to_gruppi_classificazionidettaglio.codice",
editable:false,
horizontalAlignment:0,
location:"320,20",
name:"fld_coddettaglio",
size:"80,20",
styleClass:"table",
typeid:4,
uuid:"4422367D-5D3A-4AF0-9A4F-81F1B5E6C869"
},
{
anchors:11,
horizontalAlignment:0,
labelFor:"fld_coddettaglio",
location:"320,0",
name:"lbl_coddettaglio",
size:"80,20",
styleClass:"table_header",
text:"Cod. Dettaglio",
typeid:7,
uuid:"6413BD20-B7F4-4347-A395-DCB39FCCBD3E"
},
{
anchors:11,
horizontalAlignment:0,
labelFor:"fld_descrizione",
location:"80,0",
name:"lbl_descrizione",
size:"240,20",
styleClass:"table_header",
text:"Descrizione",
typeid:7,
uuid:"75C6AABB-23AA-4423-91C1-B2FCC920B432"
},
{
anchors:11,
horizontalAlignment:0,
labelFor:"fld_dettaglio",
location:"400,0",
name:"lbl_dettaglio",
size:"240,20",
styleClass:"table_header",
text:"Dettaglio",
typeid:7,
uuid:"7EC94E4B-7B2E-4E7E-915D-13584783D769"
},
{
anchors:3,
labelFor:"fld_exclude",
location:"640,0",
name:"lbl_exclude",
size:"50,20",
styleClass:"table_header",
text:"i18n:ma.sec.lbl.filters",
typeid:7,
uuid:"80A6B389-BBE1-437E-9D8B-F7D4BC63E21F"
},
{
anchors:11,
dataProviderID:"sec_filtrigruppiclassificazionidettaglio_to_gruppi_classificazionidettaglio.gruppi_classificazionidettaglio_to_gruppi_classificazioni.descrizione",
editable:false,
location:"80,20",
name:"fld_descrizione",
size:"240,20",
styleClass:"table",
typeid:4,
uuid:"97871B3D-D8CD-447B-8BC9-4AFD62EDFE11"
},
{
anchors:11,
dataProviderID:"sec_filtrigruppiclassificazionidettaglio_to_gruppi_classificazionidettaglio.gruppi_classificazionidettaglio_to_gruppi_classificazioni.codice",
editable:false,
horizontalAlignment:0,
location:"0,20",
name:"fld_codice",
size:"80,20",
styleClass:"table",
typeid:4,
uuid:"A80708BF-47C5-41C1-9971-CD1142ED23E5"
},
{
height:40,
partType:5,
typeid:19,
uuid:"D545B66B-D494-4C8B-BEBD-43744ADFB53B"
}
],
name:"ma_sec_data_filter_gruppi_classificazioni_dettaglio_tbl",
showInMenu:true,
size:"690,40",
styleName:"leaf_style",
typeid:3,
uuid:"9FABA6DB-FFD6-4D4D-9515-27862BB47045",
view:3