/**
 * Associa l'utente ad una o più organizzazioni 
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"15179083-6899-4EB8-80D7-BA7E200D76BB"}
 */
function addRecord(event) {
	
	var _query = 'SELECT organization_id FROM sec_organization WHERE organization_id \
	              NOT IN (SELECT organization_id FROM sec_user_org WHERE user_id = ?) AND owner_id = ? \
	              ORDER BY name asc';
	var _arguments = [forms.ma_sec_main_user_access.foundset.user_id, forms.ma_sec_main.owner_id.toString()];
	var _dataSet = databaseManager.getDataSetByQuery(globals.nav_db_framework, _query, _arguments, -1);
	
	if (globals.svy_sec_showSelectionDialog('db:/svy_framework/sec_organization', _dataSet, ['organization_id'], ['name', 'sec_organization_to_sec_owner.name'], ['Organization', 'Owner'], [250, 200], 500, true) == 'select') {
		var tempFoundset = forms['svy_sec_selection_dialog_sec_organization'].foundset.duplicateFoundSet();
		for (var i = 1; i <= tempFoundset.getSize(); i++) {
			tempFoundset.setSelectedIndex(i);
			
			if (tempFoundset['is_selected'] == 1) {
				foundset.newRecord();
				foundset.organization_id = tempFoundset['organization_id'];
			}
		}
		
		forms.ma_sec_main_user_security.setValueList();
		
		if(!databaseManager.saveData())
			globals.ma_utl_showWarningDialog('Errore durante il salvataggio della organizzazione, si prega di riprovare','Aggiungi organizzazione');
	
	}
		
}