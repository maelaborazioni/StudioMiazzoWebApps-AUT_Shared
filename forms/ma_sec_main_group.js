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
 * @properties={typeid:24,uuid:"730EE8F9-0879-410B-8F29-713F86479440"}
 * @AllowToRunInFind
 */
function onDataChangeOrganizationID(oldValue, newValue, event) {
	forms.ma_sec_main_group_user_tbl.filterOrganization(organizationID);
	
	return true;
}

/**
 * @properties={typeid:24,uuid:"F6B93340-3A8D-4E17-BFB6-E3D18DC2C55B"}
 */
function enableDisableForm() {	
	var _enable = false;
	if (organizationID) {
		_enable = true;
	}
	
	elements.organizationID.enabled = _enable;
	forms.ma_sec_main_group_user_tbl.controller.enabled = _enable;
	forms.ma_sec_main_group_key_tbl.controller.enabled = _enable;
}

/**
 * @properties={typeid:24,uuid:"006688D6-748D-4948-B722-6A674A7772E8"}
 */
function setValueList() {
	var _vlRealValues = new Array();
	var _vlDisplayValues = new Array();
	var _vlFirstValue = '';
	
	if (databaseManager.hasRecords(foundset.sec_group_to_sec_owner)) {
		var _fsGroupOwners = foundset.sec_group_to_sec_owner.duplicateFoundSet();
		
		_fsGroupOwners.unrelate();
		_fsGroupOwners.sec_owner_to_sec_organization.sort('name asc');
		
		for (var i = 1; i <= _fsGroupOwners.sec_owner_to_sec_organization.getSize(); i++) {
			_fsGroupOwners.sec_owner_to_sec_organization.setSelectedIndex(i);
			_vlRealValues[i - 1] = _fsGroupOwners.sec_owner_to_sec_organization.organization_id;
			// MAVariazione - Also display the owner's name
			_vlDisplayValues[i - 1] = _fsGroupOwners.sec_owner_to_sec_organization.name + ' - ' + _fsGroupOwners.name;
//			_vlDisplayValues[i - 1] = _fsGroupOwners.sec_owner_to_sec_organization.name;
			
			if (i == 1) {
				_vlFirstValue = _fsGroupOwners.sec_owner_to_sec_organization.organization_id;
			}
		}
	}
	
	application.setValueListItems('svy_sec_group_organizations', _vlDisplayValues, _vlRealValues);
	organizationID = _vlFirstValue;
	
	forms.ma_sec_main_group_user_tbl.filterOrganization(organizationID);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"5C730060-616E-4290-9416-44A670DBED44"}
 */
function addGroup(event) {
	forms.ma_sec_main_group_tbl.addRecord(event);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"736AD64B-0D2D-40E4-A56C-4763B09E02AF"}
 */
function addUser(event) {
	forms.ma_sec_main_group_user_tbl.addRecord(event);
}

/**
 * Aggiungi una chiave al gruppo selezionato
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"43C7569A-AFD7-4CD2-B042-B1F13534B3E6"}
 */
function addKey(event) {
	forms.ma_sec_main_group_key_tbl.addRecord(event);
}

/**
 * Aggiungi un gruppo di chiavi al gruppo selezionato
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"7C8F9FA4-8702-4655-A8BA-C6A53C0C8166"}
 */
function addGroupKey(event) {
	forms.ma_sec_main_group_key_tbl.addGroupKey(event);
}

/**
 * Aggiungi un gruppo di chiavi in base al tipo di menu selezionato per l'utente
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"115290A8-DBA3-4114-A660-77779F1E1027"}
 */
function addCategoryKey(event) {
	forms.ma_sec_main_group_key_tbl.addCategoryKey(event);
}

/**
 * @properties={typeid:24,uuid:"C8D31B66-850E-42E0-A36B-F3274074B713"}
 * @AllowToRunInFind
 */
function doSearch()
{
	if (forms.ma_sec_main.searchArgument) 
	{
		foundset.find();
		foundset.owner_id = forms.ma_sec_main_owner_organization.owner_id;
		foundset.name = '#%' + forms.ma_sec_main.searchArgument + '%';
		foundset.search();
		
	} else 
		foundset.loadAllRecords();
}
