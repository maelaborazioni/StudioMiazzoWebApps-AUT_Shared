dataSource:"db:/ma_framework/sec_filtrilavoratori",
extendsID:"-1",
items:[
{
anchors:3,
labelFor:"fld_exclude",
location:"590,0",
name:"lbl_exclude",
size:"50,20",
styleClass:"table_header",
text:"i18n:ma.sec.lbl.filters",
typeid:7,
uuid:"07C57C86-B883-44FB-9786-BF076B46D355"
},
{
height:40,
partType:5,
typeid:19,
uuid:"0EE95D7D-3973-4800-991A-4D3906B6F943"
},
{
anchors:3,
dataProviderID:"exclude",
displayType:4,
horizontalAlignment:0,
location:"590,20",
name:"fld_exclude",
size:"50,20",
styleClass:"table",
typeid:4,
uuid:"10A553D5-C7D0-4456-90DC-359CC30BF2A8"
},
{
anchors:11,
dataProviderID:"sec_filtrilavoratori_to_lavoratori.codditta",
editable:false,
format:"#####",
horizontalAlignment:0,
location:"80,20",
name:"fld_ditta",
size:"80,20",
styleClass:"table",
typeid:4,
uuid:"20C46CA4-744D-4276-9078-6E5C89807234"
},
{
anchors:11,
horizontalAlignment:0,
labelFor:"fld_nominativo",
location:"160,0",
name:"lbl_nominativo",
size:"430,20",
styleClass:"table_header",
text:"Nominativo",
typeid:7,
uuid:"21648196-64DB-429F-A01C-E828028E0B09"
},
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
uuid:"2533F744-FF8A-4B24-A84B-6939205E55C9"
},
{
anchors:11,
dataProviderID:"sec_filtrilavoratori_to_lavoratori.codice",
editable:false,
format:"#####",
horizontalAlignment:0,
location:"0,20",
name:"fld_codice",
size:"80,20",
styleClass:"table",
typeid:4,
uuid:"64428C9D-A17C-4C7F-BD28-40CA51FE5F5D"
},
{
anchors:11,
dataProviderID:"sec_filtrilavoratori_to_lavoratori.nominativo",
editable:false,
location:"160,20",
name:"fld_nominativo",
size:"430,20",
styleClass:"table",
typeid:4,
uuid:"673B4643-788C-4CA4-81CE-52ABB441CD46"
},
{
anchors:11,
horizontalAlignment:0,
labelFor:"fld_ditta",
location:"80,0",
name:"lbl_ditta",
size:"80,20",
styleClass:"table_header",
text:"Ditta",
typeid:7,
uuid:"9B380E42-B187-4139-AC0B-001DE3025FF0"
}
],
name:"ma_sec_data_filter_lavoratori_tbl",
scrollbars:32,
showInMenu:true,
size:"640,40",
styleName:"leaf_style",
typeid:3,
uuid:"639B2F86-9CEE-4F9F-B7DD-5F0672CA4025",
view:3