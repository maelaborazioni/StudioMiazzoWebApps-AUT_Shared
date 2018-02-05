dataSource:"db:/svy_framework/sec_organization_to_rp_group",
extendsID:"E1B6951E-8C22-4464-9B19-707548D2B2DE",
items:[
{
height:40,
partType:5,
typeid:19,
uuid:"0CAD7BD3-0719-4C32-9938-9AC445BBDE85"
},
{
dataProviderID:"rp_group_id",
location:"52,169",
size:"140,20",
typeid:4,
uuid:"16AD3539-2D34-493F-8D10-BF2B208E81DD",
visible:false
},
{
horizontalAlignment:0,
labelFor:"fld_avviso_conferma",
location:"245,0",
name:"lbl_avviso_conferma",
size:"45,20",
styleClass:"table_header",
text:"Conf.",
toolTipText:"Se flaggato, viene inviata agli utenti del ruolo la mail di richiesta confermata ",
typeid:7,
uuid:"2C24C640-8DBC-43E4-9183-BF084BABE776"
},
{
dataProviderID:"sec_organization_to_rp_group_to_sec_organization.name",
location:"0,20",
name:"fld_organizzazione",
size:"200,20",
styleClass:"table",
typeid:4,
uuid:"364846BB-1F89-4B51-9617-C9D0FF918C0D"
},
{
horizontalAlignment:0,
labelFor:"fld_gestione_richiesta",
location:"200,0",
name:"lbl_gestion_richiesta",
size:"45,20",
styleClass:"table_header",
text:"Gestore",
toolTipText:"Se flaggato, viene inviata agli utenti del ruolo la mail di gestione richiesta ",
typeid:7,
uuid:"38E68014-DE9B-42B5-AF33-248AD547970A"
},
{
labelFor:"fld_organizzazione",
location:"0,0",
margin:"0,2,0,0",
name:"lbl_organizzazione",
size:"200,20",
styleClass:"table_header",
text:"Ruoli RP",
toolTipText:"Organizzazioni per ferie e permessi ",
typeid:7,
uuid:"39276F20-BCB6-44E4-9C06-6179A67F6101"
},
{
anchors:11,
labelFor:"btn_delete",
location:"335,0",
name:"lbl_delete",
size:"20,20",
styleClass:"table_header",
typeid:7,
uuid:"45E2ADFA-CF85-4DEE-BCE0-97B7E2418A32"
},
{
dataProviderID:"avviso_rifiuto",
displayType:4,
horizontalAlignment:0,
location:"290,20",
name:"fld_avviso_rifiuto",
size:"45,20",
styleClass:"table",
typeid:4,
uuid:"598C92EA-B000-498B-887F-5C5A01444CA8"
},
{
anchors:11,
imageMediaID:"A7B00B39-D19B-4478-9939-150AC43083FD",
location:"335,20",
name:"btn_delete",
onActionMethodID:"804E7102-C8D3-438A-8621-ADD8787F3014",
showClick:false,
size:"20,20",
toolTipText:"Elimina il ruolo dagli osservatori",
transparent:true,
typeid:7,
uuid:"85AFEE5F-8788-4C5C-AECB-F976922DDD6C"
},
{
location:"52,149",
size:"140,20",
text:"Rp Group Id",
transparent:true,
typeid:7,
uuid:"CEC12D2D-7EB0-4A97-BEB1-3C34CBEBE771",
visible:false
},
{
dataProviderID:"gestione_richiesta",
displayType:4,
horizontalAlignment:0,
location:"200,20",
name:"fld_gestione_richiesta",
size:"45,20",
styleClass:"table",
typeid:4,
uuid:"D207D8BD-B46D-4AD9-8273-CABED28F79E8"
},
{
horizontalAlignment:0,
labelFor:"fld_avviso_rifiuto",
location:"290,0",
name:"lbl_avviso_rifiuto",
size:"45,20",
styleClass:"table_header",
text:"Rif.",
toolTipText:"Se flaggato, viene inviata agli utenti del ruolo la mail di richiesta rifiutata",
typeid:7,
uuid:"E2CA18D1-60FF-475C-BED0-80201441516B"
},
{
dataProviderID:"avviso_conferma",
displayType:4,
horizontalAlignment:0,
location:"245,20",
name:"fld_avviso_conferma",
size:"45,20",
styleClass:"table",
typeid:4,
uuid:"EABF646C-DF4B-49CF-BB28-D8FDFE2DE31D"
}
],
name:"ma_sec_main_rp_group_tbl",
size:"360,40",
styleName:"leaf_style",
typeid:3,
uuid:"F9EC3760-CFA7-4DC9-8B72-E7D3EA1F6644",
view:3