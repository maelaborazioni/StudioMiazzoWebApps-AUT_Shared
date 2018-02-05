/**
 * @param event
 * @param [organization_ID]
 * @param [group_ID]
 * 
 * @properties={typeid:24,uuid:"2DD75CBF-CC48-4B52-8AB8-4CFF20646983"}
 * @AllowToRunInFind
 */
function addRecord(event, organization_ID, group_ID) {
	var _query = "SELECT \
					  sec_user.user_id \
				  FROM \
				  	    sec_user \
				  	  , sec_user_org \
				  WHERE \
				  		sec_user.user_id = sec_user_org.user_id \
				  		AND \
				  		sec_user_org.organization_id = ? \
				  		AND \
						sec_user.user_id NOT IN \
						( \
							SELECT \
								sec_user.user_id \
							FROM \
								  sec_user \
								, sec_user_org \
								, sec_user_in_group \
							WHERE \
								sec_user.user_id = sec_user_org.user_id \
								AND \
								sec_user_org.user_org_id = sec_user_in_group.user_org_id \
								AND \
								sec_user_in_group.group_id = ? \
						);";
	
	organization_ID = organization_ID || new String(forms.ma_sec_main_group.organizationID);
	group_ID = group_ID || forms.ma_sec_main_group.foundset.group_id 
	var _arguments = [organization_ID, group_ID];
	var _dataSet = databaseManager.getDataSetByQuery(globals.nav_db_framework, _query, _arguments, -1);
	
	if (globals.svy_sec_showSelectionDialog('db:/svy_framework/sec_user',
		                                    _dataSet,
											['user_id'],
											['user_id','name_compound','user_name'],
											['User ID','Nominativo','Username'],
											[50,220,220],
											500,
											true) == 'select') {
		var tempFoundset = forms['svy_sec_selection_dialog_sec_user'].foundset.duplicateFoundSet();
		for (var i = 1; i <= tempFoundset.getSize(); i++) 
		{
			tempFoundset.setSelectedIndex(i);
			
			if (tempFoundset['is_selected'] == 1) 
			{
				var dsSql = "SELECT * FROM sec_user_org WHERE user_id = ? AND organization_id = ?";
				var dsParams = [tempFoundset['user_id']
				                ,organization_ID];
				var ds = databaseManager.getDataSetByQuery(globals.Server.SVY_FRAMEWORK,dsSql,dsParams,-1);
				
				if(ds.getMaxRowIndex())
				{				   	
				   foundset.newRecord();
				   foundset.user_org_id = ds.getValue(1,1);
				   foundset.group_id = group_ID;
				   databaseManager.saveData();
//				   globals.ma_sec_hideAnotherOwnerUsers(globals.svy_sec_lgn_owner_id); 
				}
				else
					globals.ma_utl_showErrorDialog('Impossibile associare l\'utente al gruppo','Associa utente al gruppo');
			
			}
	
		}

	}
}