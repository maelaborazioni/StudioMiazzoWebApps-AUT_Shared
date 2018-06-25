dataSource:"db:/ma_framework/sec_filtridittesedi",
extendsID:"-1",
items:[
{
formIndex:55,
horizontalAlignment:0,
location:"145,53",
mediaOptions:10,
name:"select_none_employee_btn",
onActionMethodID:"A275AADE-5B1C-4293-BFF7-35E4E27825C3",
onDoubleClickMethodID:"-1",
onRightClickMethodID:"-1",
rolloverCursor:12,
showClick:false,
size:"20,20",
styleClass:"btn_cancel_40",
transparent:true,
typeid:7,
uuid:"13F132FE-045D-417A-8861-AEBA676CE879",
verticalAlignment:0
},
{
height:300,
partType:5,
typeid:19,
uuid:"2096717D-8046-47FF-BF4E-A80944185AAF"
},
{
dataProviderID:"vCompanyDescription",
editable:false,
location:"80,25",
name:"fld_ragione_sociale",
size:"550,20",
text:"i18n:sampleuse_navigation.anagrafica_ditta_dtl.RagioneSocialeFull.text",
toolTipText:"i18n:sampleuse_navigation.anagrafica_ditta_dtl.RagioneSocialeFull.toolTipText",
typeid:4,
uuid:"2F2B96E8-1E6B-4EE0-B203-FB76DB4AEF30"
},
{
anchors:15,
borderType:"SpecialMatteBorder,1.0,1.0,1.0,1.0,#434343,#434343,#434343,#434343,0.0,",
formIndex:1,
items:[
{
containsFormID:"0FBADB95-1BF8-4011-BE42-55AEAE9B8532",
location:"10,110",
relationName:"sec_filtridittesedi_to_sec_filtridittesedi",
text:"ma_sec_data_filter_sede_tbl",
typeid:15,
uuid:"DB4D2684-713F-4A01-B050-802CFE8B1DEE"
}
],
location:"10,80",
name:"values",
printable:false,
size:"620,210",
tabOrientation:-1,
transparent:true,
typeid:16,
uuid:"355EECAD-0B56-4FF7-AAD8-22F9933230F3"
},
{
dataProviderID:"vExclude",
displayType:4,
formIndex:56,
horizontalAlignment:0,
location:"235,53",
onDataChangeMethodID:"CF852010-97CD-4073-B044-C01139BB5CCC",
size:"20,20",
styleClass:"check",
transparent:true,
typeid:4,
uuid:"593C5707-0393-449F-BEBA-762B21139B96"
},
{
labelFor:"fld_codice",
location:"10,10",
mediaOptions:14,
name:"lbl_codice",
size:"50,10",
text:"Codice",
toolTipText:"i18n:sampleuse_navigation.anagrafica_ditta_dtl.label_1073742059.toolTipText",
transparent:true,
typeid:7,
uuid:"729350E0-9036-418D-B517-AF759B553581"
},
{
labelFor:"fld_ragione_sociale",
location:"80,10",
mediaOptions:14,
name:"lbl_ragione_sociale",
size:"100,10",
text:"Ragione sociale",
toolTipText:"i18n:sampleuse_navigation.anagrafica_ditta_dtl.label_1073742063.toolTipText",
transparent:true,
typeid:7,
uuid:"A493935C-4B55-4583-9CCE-01ADACDF0D65"
},
{
customProperties:"",
formIndex:2,
horizontalAlignment:0,
location:"60,53",
mediaOptions:2,
name:"employee_btn_search",
onActionMethodID:"DB93380E-66AC-49D8-8776-73602C0318A7",
onDoubleClickMethodID:"-1",
onRightClickMethodID:"-1",
rolloverCursor:12,
showClick:false,
size:"20,20",
styleClass:"btn_lookup",
transparent:true,
typeid:7,
uuid:"A558CCF5-26F3-426A-AD19-3DE622101284",
verticalAlignment:0
},
{
dataProviderID:"vCompanyCode",
horizontalAlignment:0,
location:"10,25",
name:"fld_codice",
onDataChangeMethodID:"DCBD3325-FF5C-4B8A-A4F8-82C0DFFFB9FB",
onFocusGainedMethodID:"-1",
size:"50,20",
text:"i18n:sampleuse_navigation.anagrafica_ditta_dtl.cod_ditta.text",
toolTipText:"i18n:sampleuse_navigation.anagrafica_ditta_dtl.cod_ditta.toolTipText",
typeid:4,
uuid:"B005D39C-A44A-49EE-841A-733E477A575B"
},
{
formIndex:54,
labelFor:"",
location:"95,58",
size:"50,10",
text:"Nessuno",
transparent:true,
typeid:7,
uuid:"BA0286E2-96AD-4D87-AD08-5A2B790FC809"
},
{
formIndex:54,
labelFor:"",
location:"175,58",
size:"60,10",
text:"Escludi tutti",
transparent:true,
typeid:7,
uuid:"EF5BF53A-FDB3-4E4C-ACFC-0076EC6F56FC"
},
{
borderType:"EmptyBorder,0,0,0,0",
horizontalAlignment:0,
labelFor:"",
location:"60,25",
mediaOptions:2,
name:"btnLkp",
onActionMethodID:"12C1495D-CEA9-4328-BF28-E3FBA203B4F7",
onDoubleClickMethodID:"-1",
onRightClickMethodID:"-1",
rolloverCursor:12,
showClick:false,
size:"20,20",
styleClass:"btn_lookup",
transparent:true,
typeid:7,
uuid:"F6CFA105-E324-48B4-84A6-5C2E90012685",
verticalAlignment:0
},
{
formIndex:54,
labelFor:"",
location:"10,58",
size:"50,10",
text:"Seleziona",
transparent:true,
typeid:7,
uuid:"FECCD65F-9937-4D71-9CB9-E3A4C9AA29A8"
}
],
name:"ma_sec_data_filter_sede_dtl",
navigatorID:"-1",
onLoadMethodID:"-1",
onShowMethodID:"-1",
showInMenu:true,
size:"640,300",
styleName:"leaf_style",
typeid:3,
uuid:"061F7C9C-05FC-4755-BC80-17F4C470DDA0"