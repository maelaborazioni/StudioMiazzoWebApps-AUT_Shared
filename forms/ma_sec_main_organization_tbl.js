/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"F7BC0DC1-D568-4907-8442-FA7E2391ADDE"}
 */
function addRecord(event) {
	var _query = 'SELECT organization_id FROM sec_organization WHERE organization_id NOT IN (SELECT organization_id FROM sec_user_org WHERE user_id = ?) AND owner_id = ?';
	var _arguments = [forms.ma_sec_main_user_access.foundset.user_id, globals.svy_sec_lgn_owner_id];
	var _dataSet = databaseManager.getDataSetByQuery(globals.nav_db_framework, _query, _arguments, -1);
	
	if (globals.svy_sec_showSelectionDialog('db:/svy_framework/sec_organization', _dataSet, ['organization_id'], ['name', 'sec_organization_to_sec_owner.name'], ['Organization', 'Owner'], [200, 200], 600, true) == 'select') {
		var tempFoundset = forms['svy_sec_selection_dialog_sec_organization'].foundset.duplicateFoundSet();
		for (var i = 1; i <= tempFoundset.getSize(); i++) {
			tempFoundset.setSelectedIndex(i);
			
			if (tempFoundset['is_selected'] == 1) {
				foundset.newRecord();
				foundset.organization_id = tempFoundset['organization_id'];
			}
		}
		
		databaseManager.saveData();
	}
}

/**
 * @properties={typeid:24,uuid:"5F47ECB2-C2D5-4FE8-AF2B-79D8EFA1D2C6"}
 */
function removeParentOrganization(event)
{
	if(!sec_organization_to_sec_organization_hierarchy.deleteRecord())
		globals.ma_utl_showErrorDialog('Errore durante la rimozione dell\'associazione');
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
 * @properties={typeid:24,uuid:"BC8FC822-09D3-4C6B-8B5C-57DC2C288B9A"}
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
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"6D56458A-632A-4EC3-A442-FA807664C4F7"}
 * @SuppressWarnings(wrongparameters)
 */
function lookupRuolo(event)
{
	/** @type{JSRecord<db:/svy_framework/sec_organization>} */
	var parent_organization = globals.ma_utl_showLkpWindow
	(
		{
			  lookup: 'AUT_Lkp_Organization'
			, event: event
			, methodToAddFoundsetFilter: 'filterOrganization'
			, fieldToReturn: 'organization_id'
			, returnFullRecords: true
		}
	);
	
	if(!globals.ma_utl_isNullOrUndefined(parent_organization))
	{
		var record = sec_organization_to_sec_organization_hierarchy && sec_organization_to_sec_organization_hierarchy.getSelectedRecord();
		if(!record)
			record = sec_organization_to_sec_organization_hierarchy.getRecord(sec_organization_to_sec_organization_hierarchy.newRecord());

		record.parent_organization_id = parent_organization.organization_id;
		
		databaseManager.saveData(record);
	}
}

/**
 * @properties={typeid:24,uuid:"6290B125-B681-4300-9304-B65785AD2713"}
 */
function filterOrganization(fs)
{
	if(fs)
	{
		var validParents = getValidParents(organization_id.toString(), owner_id.toString());
		fs.addFoundSetFilterParam('organization_id', globals.ComparisonOperator.IN, validParents.getColumnAsArray(2));
	}
	
	return fs;
}
