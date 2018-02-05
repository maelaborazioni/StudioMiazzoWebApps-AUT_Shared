/**
 * @param {String} [parent_organization_ID]
 * 
 * @properties={typeid:24,uuid:"26B6339B-0647-4212-AE02-1FA465B183E4"}
 */
function addRecord(parent_organization_ID) 
{
	var fs = forms.ma_sec_main_new_organization.foundset;
	
	fs.newRecord();
	fs.owner_id = forms.ma_sec_main_owner_organization.owner_id;
	fs.is_client = 1;
	
	setValueList(fs.organization_id, fs.owner_id);
	
	if(parent_organization_ID)
	{
		fs.sec_organization_to_sec_organization_hierarchy.newRecord();
		fs.sec_organization_to_sec_organization_hierarchy.parent_organization_id = parent_organization_ID;
	}
	
	var window = application.createWindow('ma_sec_main_new_organization', JSWindow.MODAL_DIALOG);
	window.title = i18n.getI18NMessage('svy.fr.lbl.organization');
	window.show('ma_sec_main_new_organization');
}

/**
 * @properties={typeid:24,uuid:"AE8B4CA2-25EA-4D19-8479-2722D5FD1AE0"}
 * 
 * @param {String} owner_ID
 * 
 * @AllowToRunInFind
 */
function refreshTree(owner_ID)
{
	if(!owner_ID)
		return;
	
	databaseManager.saveData();
	
	var organizationDataSource = globals.ma_utl_getDataSource(globals.Server.SVY_FRAMEWORK, 'sec_organization');
	var hierarchyDataSource = globals.ma_utl_getDataSource(globals.Server.SVY_FRAMEWORK, 'sec_organization_hierarchy');
	
	elements.organization_hierarchy.removeAllRoots();
	
	/** @type {JSFoundset<db:/svy_framework/sec_organization>} */
	var parents = databaseManager.getFoundSet(globals.nav_db_framework, 'sec_organization');
	var sqlQuery = "SELECT \
						org.organization_id \
					FROM \
						sec_organization org \
						LEFT OUTER JOIN sec_organization_hierarchy soh \
							ON soh.organization_id = org.organization_id \
					WHERE \
						soh.parent_organization_id IS NULL \
						AND \
						org.owner_id = ?;";
	
	var dataset = databaseManager.getDataSetByQuery(globals.nav_db_framework, sqlQuery, [owner_ID.toString()], -1);		
	parents.loadRecords(dataset);
	
	var binding = elements.organization_hierarchy.createBinding(organizationDataSource);
		binding.setTextDataprovider('name');
		binding.setMethodToCallOnClick(updateCurrentRecord, 'organization_id');
//		binding.setChildSortDataprovider('name_calc_org');
		binding.setImageURLDataprovider('icon_calc');
		binding.setNRelationName('sec_organization_to_sec_organization_hierarchy_children');
		
	var	binding_2 = elements.organization_hierarchy.createBinding(hierarchyDataSource);
		binding_2.setNRelationName('sec_organization_hierarchy_to_sec_organization_hierarchy_children');
		binding_2.setTextDataprovider('sec_organization_hierarchy_to_sec_organization.name');
		binding_2.setMethodToCallOnClick(updateCurrentRecord, 'organization_id');
//		binding_2.setChildSortDataprovider('name_calc_org_hierarchy');
		binding_2.setImageURLDataprovider('icon_calc');
	
	elements.organization_hierarchy.addRoots(parents);
}

/**
 * @properties={typeid:24,uuid:"9565CE8B-C02B-4340-BA6E-0DF79CAEB63A"}
 */
function deleteOrganization(item_idx, parent_item_idx, is_selected, parent_menu_text, menu_text)
{
	deleteRecord();
}

/**
 * @properties={typeid:24,uuid:"495E8381-6E2B-4A33-A652-A863D3756013"}
 */
function deleteRecord()
{
	try
	{
		var answer = globals.ma_utl_showYesNoQuestion(i18n.getI18NMessage('svy.fr.dlg.delete') + '\n' + i18n.getI18NMessage('ma.aut.msg.delete_children'));
		if (answer)
		{
			globals.ma_utl_startTransaction();
			
			var fs = forms.ma_sec_main_new_organization.foundset;
				fs.loadRecords(organization_id);
				
			/**
			 * Also delete related system groups
			 */
			var groupFs = forms.ma_sec_main_organization_group_tbl.foundset;
			
			groupFs.loadRecords("select sg.group_id from sec_group sg inner join sec_system_group ssg on ssg.group_id = sg.group_id where ssg.for_organization = ?", [organization_id.toString()]);
			groupFs.deleteAllRecords();
			fs.deleteRecord();
			
			globals.ma_utl_commitTransaction();
				
			refreshTree(forms.ma_sec_main_owner_organization.owner_id.toString());
		}
	}
	catch(ex)
	{
		globals.ma_utl_rollbackTransaction();
		globals.ma_utl_logError(ex);
	}
}

/**
 * @properties={typeid:24,uuid:"78A1B55B-DC64-448F-A101-A5B4583FF881"}
 */
function addChild()
{
	addRecord(organization_id.toString());
}

/**
 * @param {UUID} organization_ID
 * 
 * @properties={typeid:24,uuid:"BC1F444B-D1EA-4416-9920-6B8AB0267C3F"}
 * @AllowToRunInFind
 */
function updateCurrentRecord(organization_ID)
{
	databaseManager.saveData();
	
	foundset.loadRecords(organization_ID);
	if(foundset.getSize() === 0)
	{
		foundset.newRecord();
		foundset.organization_id = organization_ID;
	}
	
	setValueList(organization_ID, application.getUUID(owner_id_calc));
	
	/**
	 * Update the keys associated with the organization (only those assigned to
	 * system groups are considered)
	 */
	updateGroupsAndKeys();
	
	updateRpGroupsAndUsers();

}

/**
 * @properties={typeid:24,uuid:"72BA1A8E-ABA7-47C7-BE15-0849D6EFC5AB"}
 */
function updateGroupsAndKeys()
{
	var sqlQuery = "select \
						sg.group_id \
					from \
						sec_group sg \
						inner join sec_system_group ssg \
							on ssg.group_id = sg.group_id \
					where \
						sg.owner_id = ? \
						and ssg.for_organization = ?";
	
	var dataset = databaseManager.getDataSetByQuery(globals.nav_db_framework, sqlQuery, [owner_id_calc, organization_id.toString()], -1);
	if (dataset && dataset.getMaxRowIndex() > 0)
		forms.ma_sec_main_organization_group_tbl.foundset.loadRecords(dataset);
	else
		forms.ma_sec_main_organization_group_tbl.foundset.clear();
		
	var group_ID = forms.ma_sec_main_organization_group_tbl.group_id;
	if (group_ID)
	{
		/**
		 * Update the groups' users
		 */
		sqlQuery = "select \
						sug.user_in_group_id \
					from \
						sec_user_in_group sug \
						inner join sec_user_org suo \
							on suo.user_org_id = sug.user_org_id \
					where \
						sug.group_id = ? \
						and suo.organization_id = ?";
		
		dataset = databaseManager.getDataSetByQuery(globals.nav_db_framework, sqlQuery, [group_ID, organization_id.toString()], -1);
		if(dataset && dataset.getMaxRowIndex() > 0)
		{
			// vengono caricati due volte perchè a volte passando da un livello all'altro (specialmente nel caso di singolo utente) non viene aggiornato correttamente
			forms.ma_sec_main_organization_group_user_tbl.foundset.loadRecords(dataset);
			forms.ma_sec_main_organization_group_user_tbl.foundset.loadRecords(dataset);
		}
		else
			forms.ma_sec_main_organization_group_user_tbl.foundset.clear();
			
		/**
		 * Update the groups' keys
		 */
		sqlQuery = "select \
						sur.user_right_id \
					from \
						sec_user_right sur \
					where \
						sur.group_id = ?";
		
		dataset = databaseManager.getDataSetByQuery(globals.nav_db_framework, sqlQuery, [group_ID], -1);
		if(dataset && dataset.getMaxRowIndex() > 0)
			forms.ma_sec_main_organization_key_tbl.foundset.loadRecords(dataset);
		else
			forms.ma_sec_main_organization_key_tbl.foundset.clear();
	}
	else
	{
		forms.ma_sec_main_organization_group_user_tbl.foundset.clear();
		forms.ma_sec_main_organization_key_tbl.foundset.clear();
	}
}

/**
 * @properties={typeid:24,uuid:"DD83B361-4E73-485E-B940-AB9E52EB54C4"}
 */
function updateRpGroupsAndUsers()
{
	// loading associated groups
	var fsGroups = globals.getRpGroupsInfo(organization_id.toString());
	
	forms.ma_sec_main_rp_group_tbl.foundset.clear();
	forms.ma_sec_main_rp_user_tbl.foundset.clear();
	
	if(fsGroups)
		forms.ma_sec_main_rp_group_tbl.foundset.loadRecords(fsGroups);
//	else
//		forms.ma_sec_main_rp_group_tbl.foundset.clear();
	
	// loading associated users
	var fsUsers = globals.getRpUsersInfo(organization_id.toString());
	
	if(fsUsers)
		forms.ma_sec_main_rp_user_tbl.foundset.loadRecords(fsUsers);
//	else
//		forms.ma_sec_main_rp_user_tbl.foundset.clear();
}

/**
 * @properties={typeid:24,uuid:"81AED86A-414B-46EF-877A-79100EC492B7"}
 */
function clear()
{
	forms.ma_sec_main_organization_group_tbl.foundset.clear();
	forms.ma_sec_main_organization_group_user_tbl.foundset.clear();
	forms.ma_sec_main_organization_key_tbl.foundset.clear();
}

/**
 * @param {UUID} [organization_ID]
 * @param {UUID} [owner_ID]
 * 
 * @properties={typeid:24,uuid:"C980E288-8249-48FC-8B36-C1BC6A4F46E9"}
 */
function setValueList(organization_ID, owner_ID)
{
	if(!organization_ID)
		organization_ID = organization_id.toString();
	else
		organization_ID = organization_ID.toString();
	
	if(!owner_ID)
		owner_ID = owner_id_calc.toString();
	else
		owner_ID = owner_ID.toString();
	
	application.setValueListItems('ma_sec_parent_organization', getValidParents(organization_ID.toString(), owner_ID.toString())); 
}

/**
 * Returns the available parent organizations for the provided organization, i.e. those for
 * which the current assignment would not result in a cycle within the hierarchy tree. 
 * It does so by searching for children of <code>organization_ID</code> and removing them
 * from the list or available organizations
 * 
 * @param {String} organization_ID
 * @param {String} owner_ID
 * 
 * @return {JSDataSet} the ids and names of available organizazions
 *
 * @properties={typeid:24,uuid:"D34A73E5-9CB7-4A82-9B6C-EF1F5BADBFB4"}
 */
function getValidParents(organization_ID, owner_ID)
{
	var sqlQuery = "WITH RECURSIVE hierarchy(organization_id) AS \
					(\
						SELECT \
							CAST(? AS char varying(50)) AS organization_id \
						\
						UNION ALL \
						\
						SELECT \
							soh.organization_id \
						FROM \
							sec_organization_hierarchy soh \
							INNER JOIN hierarchy h \
								ON h.organization_id = soh.parent_organization_id \
					)\
					SELECT \
						    org.name \
						  , org.organization_id \
					FROM \
						sec_organization org \
						LEFT OUTER JOIN hierarchy h \
							ON h.organization_id = org.organization_id \
						WHERE \
							org.owner_id = ? \
							AND \
							h.organization_id IS NULL;";
	
	var dataset = databaseManager.getDataSetByQuery(globals.nav_db_framework, sqlQuery, [organization_ID, owner_ID], -1);
	return dataset;
}

/**
 * Handle changed data.
 *
 * @param oldValue old value
 * @param newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"80415AB3-87DE-4440-A2C1-DCF343E1E689"}
 */
function refreshTreeStructure(oldValue, newValue, event) 
{
	refreshTree(owner_id_calc);
	return true;
}

/**
 * Aggiungi una chiave di sicurezza
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"7F4C7809-E7D7-47A0-BB2F-C1971A145E30"}
 */
function addKey(event) 
{
	forms.ma_sec_main_organization_key_tbl.addRecord(event, owner_id_calc, forms.ma_sec_main_organization_group_tbl.group_id);
}

/**
 * Aggiungi le chiavi associate al gruppo selezionato
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"AC648A3D-35AB-4D66-8358-3801F6E7ED7D"}
 */
function addKeyGroup(event)
{
	forms.ma_sec_main_organization_key_tbl.addGroupKey(event);
}

/**
 * Aggiungi le chiavi associate alla categoria di utenza selezionata
 * 
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"9FEC8119-5D36-4E73-8728-35130A3AE53C"}
 */
function addKeyCategory(event)
{
	forms.ma_sec_main_organization_key_tbl.addCategoryKey(event);
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"8C7A4631-7967-460A-886E-1C9BC484D72B"}
 */
function onShow(firstShow, event)
{
	if(foundset && foundset.getSize() > 0)
		updateGroupsAndKeys();
	
	// la possibilità di associare la singola chiave (e quindi anche quelle di gestione)
	// è vincolata a chi ha diritti di amministrazione
	elements.btn_add_key.enabled = _to_sec_user$user_id.flag_super_administrator ?_to_sec_user$user_id.flag_super_administrator : false;

	// la visualizzazione dei tab di gestione di ruoli/utenti per il ferie e permessi è
	// legata al possesso del modulo stesso
	var rp = globals.ma_utl_hasKey(globals.Key.RICHIESTA_PERMESSI); 
	elements.tab_rp_groups.visible = 
		elements.tab_rp_users.visible =
			elements.btn_add_rp_group.visible =
				elements.btn_add_rp_user.visible = rp;
	
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"5A9C1EB8-8340-4BF3-BD3C-608370F92F34"}
 */
function addUser(event) 
{
	forms.ma_sec_main_organization_group_user_tbl.addRecord(event, organization_id.toString(), forms.ma_sec_main_organization_group_tbl.group_id);
}

/**
 * Handle changed data.
 *
 * @param oldValue old value
 * @param newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"DD1D86BF-05EA-4B10-BB40-77C437B8C593"}
 */
function onDataChangeName(oldValue, newValue, event) 
{
	if(!newValue)
		return false;
	
	if(sec_organization_hierarchy_to_sec_organization.sec_organization_to_sec_system_group)
		sec_organization_hierarchy_to_sec_organization.sec_organization_to_sec_system_group.sec_system_group_to_sec_group.name = newValue;
	
	return true;
}

/**
 * Filtra i gruppi selezionabili dall'utente correntemente loggato
 * 
 * @param {JSFoundset} fs
 *
 * @properties={typeid:24,uuid:"BFF6F4FB-465A-4C94-BCBE-9285E5E68937"}
 */
function filterRpGroups(fs)
{
	return fs;
}

/**
 * Aggiorna la visualizzazione con i gruppi selezionati
 * 
 * @param {Array<JSRecord>} _recs
 *
 * @properties={typeid:24,uuid:"C11B4848-86E4-4DB5-B057-DD26FD98BB59"}
 */
function updateRpGroups(_recs)
{
	var frm = forms.ma_sec_main_rp_group_tbl;
	var fs = frm.foundset;
	
	for(var r = 0; r < _recs.length; r++)
	{
		databaseManager.startTransaction();
		
		var newRecIndex = fs.newRecord();
		if(newRecIndex != -1)
		{
			fs.organization_id = foundset.organization_id//_recs[r]['organization_id'];
			fs.rp_group_id = _recs[r];
			
			if(!databaseManager.commitTransaction())
			   globals.ma_utl_showErrorDialog('Error saving group data...');
			
		}
		
		databaseManager.rollbackTransaction();
	}
}

/**
 * Filtra gli utenti selezionabili dall'utente correntemente loggato
 * 
 * @param {JSFoundset} fs
 *
 * @properties={typeid:24,uuid:"ED17140E-77C9-4853-A2B2-9C301323239A"}
 */
function filterRpUsers(fs)
{
	// TODO
	return fs;
}

/**
 * Aggiorna la visualizzazione con gli utenti selezionati
 * 
 * @param {Array<JSRecord>} _recs
 *
 * @properties={typeid:24,uuid:"E5BEFB1C-7B15-4132-BBFC-06E067A9B962"}
 */
function updateRpUsers(_recs)
{
	var frm = forms.ma_sec_main_rp_user_tbl;
	var fs = frm.foundset;
	
	for(var r = 0; r < _recs.length; r++)
	{
		databaseManager.startTransaction();
		
		var newRecIndex = fs.newRecord();
		if(newRecIndex != -1)
		{
			fs.organization_id = foundset.organization_id//_recs[r]['organization_id'];
			fs.rp_user_id = _recs[r];
			
			if(!databaseManager.commitTransaction())
			   globals.ma_utl_showErrorDialog('Error saving user data...');
			
		}
		
		databaseManager.rollbackTransaction();
	}
}

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"97765865-5387-4775-A508-801F3069A56F"}
 */
var chart = '';
//	'<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"> \
//    $(document).ready(function(){google.charts.load("current", {packages:["orgchart"]});	 \
//      google.charts.setOnLoadCallback(drawChart);		 		\
//	 \
//      function drawChart() {		 \
//        var data = new google.visualization.DataTable(); 	 \
//        data.addColumn("string", "Name");		 			\
//        data.addColumn("string", "Manager");				 \
//        data.addColumn("string", "ToolTip");				 \
//   	 \
//        data.addRows([			 \
//          [{v:"Mike", f:"Mike<div style="color:red; font-style:italic">President</div>"}, 	 \
//           "", "The President"],			 \
//          [{v:"Jim", f:"Jim<div style="color:red; font-style:italic">Vice President</div>"},	 \
//           "Mike", "VP"],							 \
//          ["Alice", "Mike", ""],					 \
//          ["Buff", "Alice", ""],					 \
//          ["Bob", "Jim", "Bob Sponge"],				 \
//          ["Carol", "Bob", ""]					 	 \
//        ]);		 \
//   	 \
//	 \
//        var chart = new google.visualization.OrgChart(document.getElementById("chart_div"));	 \
//        // Draw the chart, setting the allowHtml option to true for the tooltips.	 \
//        chart.draw(data, {allowHtml:true, allowCollapse:true, nodeClass :"nc", selectedNodeClass :"sc"});	 \
//      }	\
//      }); \
//</script><div id="chart_div"></div>';



/**
 * TODO generated, please specify type and doc for the params
 * @param ownerID
 *
 * @properties={typeid:24,uuid:"08CB6803-1610-4619-A0E3-7B3E4A22DE05"}
 */
function ma_sec_getHierarchy(ownerID)
{
	var sqlHie = 'WITH RECURSIVE hierarchy(organization_id, parent_organization_id) AS \
( \
	SELECT \
		organization_id, \
		CAST(NULL AS character varying(50)) AS parent_organization_id \
	FROM \
		sec_organization_hierarchy \
	WHERE \
		parent_organization_id is null \
	UNION ALL \
	SELECT \
		soh.organization_id, \
		soh.parent_organization_id \
	FROM \
		sec_organization_hierarchy soh \
		INNER JOIN hierarchy h \
			ON soh.parent_organization_id = h.organization_id \
	WHERE \
		soh.organization_id <> soh.parent_organization_id \
) \
select \
	h.organization_id, \
	h.parent_organization_id, \
	so.name \
from \
	hierarchy h \
	inner join sec_organization so \
		on so.organization_id = h.organization_id \
where \	so.owner_id = ?'
		
	var arrHie = [ownerID];
	var dsHie = databaseManager.getDataSetByQuery('SVY_FRAMEWORK',sqlHie,arrHie,-1);
	
	return dsHie;
	
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"A5306830-664F-4C15-87EB-32384C6B3C46"}
 */
function onActionBtnOrganigramma(event) 
{
	var frm = forms.ma_sec_organigramma;
	frm.vOwnerID = globals.svy_sec_lgn_owner_id;
	
	globals.ma_utl_showFormInDialog(frm.controller.getName()
		                            ,'Organigramma aziendale'
									,null
									,true
									,application.getScreenWidth() - 50
									,application.getScreenHeight() - 50);
}


