/**
 * @properties={typeid:35,uuid:"1F9CD292-6DE4-46FF-B6D3-40C036C350CA",variableType:-4}
 */
var vOwnerID = null;
/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"22EDDBF4-A886-4F38-A4D7-770D3D236A6D"}
 */
var chart;
/**
 * Visualizza l'organigramma del proprietario selezionato in un frame dedicato
 *
 * @param {Boolean} firstShow
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"B2C9A083-2146-45F8-B726-C28A778BE5C2"}
 */
function onShow(firstShow,event)
{
	plugins.WebClientUtils.addJsReference('http://mrrio.github.io/jsPDF/dist/jspdf.debug.js');
	plugins.WebClientUtils.addJsReference('https://www.google.com/jsapi'); 
   
	var datasource = [];
	var dataset = globals.ma_sec_getHierarchy(vOwnerID);
	var parentOrgNameStd = 'Utenti';
	
	for(var d = 1; d <= dataset.getMaxRowIndex(); d++)
	{
		var str = '';
		var orgId = dataset.getValue(d,1);
		var orgName = dataset.getValue(d,3);
		var parentOrgId = dataset.getValue(d,2);
		var parentOrgName = parentOrgId ? globals.getOrganizationName(parentOrgId) : null;
				
		var dsOrgUsers = globals.getOrganizationUsersInfo(dataset.getValue(d,1));
		for(var ou = 1; ou <= dsOrgUsers.getMaxRowIndex(); ou++)
			if(dsOrgUsers.getValue(ou,3) == globals.svy_sec_lgn_owner_id)
				str += dsOrgUsers.getValue(ou,2) + '<br/>';
				
		var objHie = {v:orgId, f:'<div style="color:red; font-weight:normal; width: 200px;">' + orgName + '</div><br/>' +  str};
		var obj = [objHie,parentOrgName != parentOrgNameStd ? parentOrgId : null,'prova tooltip'];
				
		if(parentOrgId != null && orgName != parentOrgNameStd)
		   datasource.push(obj);
	}
		
   var chartOptions = {
      title:'Organigramma aziendale',
        //'width':5000,
        //'height':600,
        size:'small',
		allowHtml:true, 
		allowCollapse:true,
		nodeClass :'nc',
		selectedNodeClass :'sc'
   };
    
   
   chart = '<script type="text/javascript">\
         google.load("visualization", "1.0", {"packages":["orgchart"]});\
         google.setOnLoadCallback(drawChart);						\
         function drawChart() {										\
              var data = new google.visualization.DataTable(); 	 	\
				data.addColumn("string", "Name");		 			\
				data.addColumn("string", "Manager");				\
				data.addColumn("string", "ToolTip");				\
             data.addRows('+ plugins.serialize.toJSON(datasource) +');			\
             var options = ' + plugins.serialize.toJSON(chartOptions) + ';	\
             var chart = new google.visualization.OrgChart(document.getElementById("chart_div"));	\
             chart.draw(data, options);	 \
            }\
          </script>\
          \
		<style> \
			.sc{background-color:#FFFFCE !important; border-radius: 5px !important; \
			border: 1px solid #3388DD !important; color:#000000!important;} \
			.nc{background-color:#fff; border: 1px solid #3388DD; border-radius: 5px; \
			font-size: 12px!important; font-family:Arial; color:#111111; \
			padding:10px 20px !important;} \
		</style>\
			 \
			 \
			 <br> \
			 <div style="text-align:right; padding-right:10px;"> \
			 \
         <div id="chart_div"></div> \
    \
     	<script type="text/javascript"> \
         $(window).on("load", function() { \
         var doc = new jsPDF("l, mm, a3"); \
        var specialElementHandlers = { \
            "#editor": function (element, renderer) { \
                return true;  \
            } \
        };\
        $("#cmd").click(function () { \
            doc.fromHTML($("#chart_div").html(), 20, 20, { \
                "width": 380,  \
                    "elementHandlers": specialElementHandlers \
            }); \
            	\
            doc.save("Organigramma_aziendale.pdf"); \
        })}); \
     </script> \
     \
<div id="content" style="display:none";><h1>Testo di prova</h1><p>Prova</p></div><br> \
<div id="editor"></div> \
';
}