/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"980250DD-9AA8-4709-A071-FC01AC907A01"}
 */
function addRecord(event) {
	var _query = 'SELECT sec_group.group_id FROM sec_group,\
	                     sec_organization \
	                     WHERE sec_group.owner_id = sec_organization.owner_id \
	                     AND sec_organization.organization_id = ? \
	                     ORDER BY sec_group.name asc';
	var _arguments = [new String(forms.ma_sec_main_user_security.organizationID)];
	var _dataSet = databaseManager.getDataSetByQuery(globals.nav_db_framework, _query, _arguments, -1);
	
	if (globals.svy_sec_showSelectionDialog('db:/svy_framework/sec_group', _dataSet, ['group_id'], ['name'], ['Groups'], [200], 600, true) == 'select') {
		var tempFoundset = forms['svy_sec_selection_dialog_sec_group'].foundset.duplicateFoundSet();
		for (var i = 1; i <= tempFoundset.getSize(); i++) {
			tempFoundset.setSelectedIndex(i);
			
			if (tempFoundset['is_selected'] == 1) {
				foundset.newRecord();
				foundset.group_id = tempFoundset['group_id'];
			}
		}
		
		databaseManager.saveData();
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"7136FFEF-D7B5-4847-B9D1-3F76AD2B2FCE"}
 */
function deleteRecord(event) 
{
	var sql = "delete from sec_user_in_group SUIG \
               where SUIG.group_id = ?\
               and SUIG.user_in_group_id = ?";
	var success = plugins.rawSQL.executeSQL(globals.Server.SVY_FRAMEWORK,
                                            'sec_user_in_group',
		                                     sql,
		                                     [foundset.group_id,foundset.user_in_group_id]);
	if(success)
		plugins.rawSQL.flushAllClientsCache(globals.Server.SVY_FRAMEWORK,'sec_user_in_group');
	else
		globals.ma_utl_showErrorDialog('Record non eliminato,riprovare','Elimina gruppo utente');
}