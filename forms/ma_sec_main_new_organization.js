/**
 * @properties={typeid:24,uuid:"C00AE900-0CF1-45F0-A597-F4A3E4323C92"}
 */
function btnOK(event)
{
	try
	{
		globals.ma_utl_startTransaction();
		
		/**
		 * Crea anche il gruppo correlato e rendilo non modificabile
		 */
		forms.ma_sec_main_group_tbl.addRecord(event);
		
		var fs = forms.ma_sec_main_group_tbl.foundset;
		
			fs.name = name;
			fs.sec_group_to_sec_system_group.newRecord();
			fs.sec_group_to_sec_system_group.locked = 1;
			fs.sec_group_to_sec_system_group.for_organization = organization_id.toString();
		
		_super.btnOK(event);
		
		globals.ma_utl_commitTransaction();
		
		forms.ma_sec_main_organization_tree.refreshTree(owner_id.toString());
	}
	catch(ex)
	{
		globals.ma_utl_rollbackTransaction();
		globals.ma_utl_showErrorDialog(ex.message,'Aggiungi ruolo');
		globals.ma_utl_logError(ex);
	}
}

/**
 * @properties={typeid:24,uuid:"830D2181-E206-4175-804B-2C0CAC74AEC0"}
 */
function btnCancel(event)
{
	_super.btnCancel(event);
	forms.ma_sec_main_organization_tree.setValueList();
}
