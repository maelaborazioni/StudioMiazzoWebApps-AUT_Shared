/**
 * @param event
 * @param [owner_ID]
 * @param [group_ID]
 * 
 * @properties={typeid:24,uuid:"469EB0D8-8744-4A3C-8E4E-4537DB61DE9A"}
 */
function addRecord(event, owner_ID, group_ID) {
	var _query = "SELECT \
						ssk.security_key_id \
					FROM \
						sec_security_key ssk \
					WHERE \
						ssk.security_key_id NOT IN \
						(\
							SELECT \
								security_key_id \
							FROM \
								sec_user_right \
							WHERE \
								group_id = ? \
						)\
						AND \
						(\
							ssk.owner_id = ? \
							OR \
							ssk.owner_id IS NULL \
							AND \
							ssk.module_id IN \
							(\
								SELECT \
									som.module_id \
								FROM \
									sec_owner_in_module som \
								WHERE \
									som.owner_id = ? \
									AND \
									(som.start_date IS NULL OR som.start_date <= ?) \
									AND \
									(som.end_date IS NULL OR som.end_date >= ?) \
							) \
							AND \
							ssk.is_client_selectable = 1 \
						) \
						ORDER BY ssk.name asc;";
	
	
	owner_ID = owner_ID || forms.ma_sec_main_group.owner_id.toString();
	group_ID = group_ID || forms.ma_sec_main_group.group_id;
	var _arguments = 
		[
			  group_ID
			, owner_ID
			, owner_ID
			, new Date()
			, new Date()
		];
		
	var _dataSet = databaseManager.getDataSetByQuery(globals.nav_db_framework, _query, _arguments, -1);
	
	if (globals.svy_sec_showSelectionDialog('db:/svy_framework/sec_security_key', _dataSet, ['security_key_id'], ['name'], ['Keys'], [200], 600, true) == 'select') {
		var tempFoundset = forms['svy_sec_selection_dialog_sec_security_key'].foundset.duplicateFoundSet();
		for (var i = 1; i <= tempFoundset.getSize(); i++) {
			tempFoundset.setSelectedIndex(i);
			
			if (tempFoundset['is_selected'] == 1) {
				foundset.newRecord();
				foundset.security_key_id = tempFoundset['security_key_id'];
				foundset.group_id = group_ID;
			}
		}
		
		databaseManager.saveData();
	}
}

/**
 * Aggiungi le chiavi dei gruppi selezionati 
 * 
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"7AD4299D-4F06-4575-ABF6-267A00CB9CDF"}
 * @AllowToRunInFind
 */
function addGroupKey(event) 
{
	// creazione della lookup di scelta con i gruppi di chiavi
	var arrGroupKeys = globals.svy_nav_showLookupWindow(event,null,'AUT_Lkp_GroupKeys','','FilterGroupKey',null,null,null,true,null,null,true);
	if (arrGroupKeys) 
	{
		var length = arrGroupKeys['length'];
		// per ogni gruppo selezionato, vanno recuperate le chiavi associate al gruppo di chiavi
		for (var gk = 1; gk <= length; gk++)
		{
			/** @type {JSFoundset<db:/svy_framework/sec_security_key_to_group>} */
			var _foundsetKey = databaseManager.getFoundSet(globals.Server.SVY_FRAMEWORK, 'sec_security_key_to_group');
			if (_foundsetKey.find()) {
				// gestione salvataggio chiavi in base al gruppo
				_foundsetKey.sec_security_key_group_id = arrGroupKeys[gk - 1];

				var _groupKeySize = _foundsetKey.search();
				for (var gks = 1; gks <= _groupKeySize; gks++) {
					// per ciascuna chiave trovata inserisce in tabella la coppia (id chiave,gruppo)
					_foundsetKey.setSelectedIndex(gks);
					// controlla se la chiave è già stata assegnata per il gruppo in questione altrimenti non la inserisce di nuovo
					if (!globals.ma_sec_getSecurityKeyForGroup(forms.ma_sec_main_group.group_id, _foundsetKey.security_key_id)) {
						foundset.newRecord();
						foundset.security_key_id = _foundsetKey.security_key_id;
						foundset.group_id = forms.ma_sec_main_group.group_id;
					}
				}
			}
// OLD code			
//			/** @type {JSFoundset<db:/svy_framework/sec_security_key>} */
//			var _foundsetKey = databaseManager.getFoundSet(globals.Server.SVY_FRAMEWORK, 'sec_security_key');
//			if (_foundsetKey.find()) {
//				// gestione salvataggio chiavi in base al gruppo
//				_foundsetKey.sec_security_key_group_id = arrGroupKeys[gk - 1];
//
//				var _groupKeySize = _foundsetKey.search();
//				for (var gks = 1; gks <= _groupKeySize; gks++) {
//					// per ciascuna chiave trovata inserisce in tabella la coppia (id chiave,gruppo)
//					_foundsetKey.setSelectedIndex(gks);
//					// controlla se la chiave è già stata assegnata per il gruppo in questione altrimenti non la inserisce di nuovo
//					if (!globals.ma_sec_getSecurityKeyForGroup(forms.ma_sec_main_group.group_id, _foundsetKey.security_key_id)) {
//						foundset.newRecord();
//						foundset.security_key_id = _foundsetKey.security_key_id;
//						foundset.group_id = forms.ma_sec_main_group.group_id;
//					}
//				}
//			}
		}
		
		if(!databaseManager.saveData())
			globals.ma_utl_showWarningDialog('Errore durante il salvataggio del gruppo di chiavi,verificare l\'inserimento','Aggiungi gruppo di chiavi');
		
	} else
		globals.ma_utl_showInfoDialog('Non è stato selezionato alcun gruppo di chiavi','Aggiungi gruppo di chiavi');

}

/**
 * Aggiungi le chiavi per le categorie selezionate
 * 
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"07D6B5D5-1A67-4CA8-ADB2-7F4BE7D381CB"}
 * @AllowToRunInFind
 */
function addCategoryKey(event)
{
	// creazione della lookup di scelta con i gruppi di chiavi
	var menuKey = globals.svy_nav_showLookupWindow(event, null, 'AUT_Lkp_CategoryKeys', null, 'FilterOwnerKeys', null,
		                                                null, 'sec_security_key_cathegory_id', true, null, null, false);
	
	if (menuKey) 
	{
		/** @type {JSFoundset<db:/svy_framework/sec_security_key_to_cathegory>} */
		var _foundsetKey = databaseManager.getFoundSet(globals.Server.SVY_FRAMEWORK, 'sec_security_key_to_cathegory');
		if (_foundsetKey.find())
		{
			// gestione salvataggio chiavi in base al menu selezionato
			_foundsetKey.sec_security_key_cathegory_id = menuKey;
            
			var _menuKeySize = _foundsetKey.search();
			for (var mks = 1; mks <= _menuKeySize; mks++)
			{
				// per ciascuna chiave trovata inserisce in tabella la coppia (id chiave,gruppo)
				_foundsetKey.setSelectedIndex(mks);
				// controlla se la chiave è già stata assegnata per il gruppo in questione altrimenti non la inserisce di nuovo
				if (!globals.ma_sec_getSecurityKeyForGroup(forms.ma_sec_main_group.group_id, _foundsetKey.security_key_id)) {
					foundset.newRecord();
					foundset.security_key_id = _foundsetKey.security_key_id;
					foundset.group_id = forms.ma_sec_main_group.group_id;
				}
			}
		}

// OLD code		
//		/** @type {JSFoundset<db:/svy_framework/sec_security_key>} */
//		var _foundsetKey = databaseManager.getFoundSet(globals.Server.SVY_FRAMEWORK, 'sec_security_key');
//		if (_foundsetKey.find())
//		{
//			// gestione salvataggio chiavi in base al menu selezionato
//			_foundsetKey.sec_security_key_cathegory_id = '<='  + menuKey;
//            
//			var _menuKeySize = _foundsetKey.search();
//			for (var mks = 1; mks <= _menuKeySize; mks++)
//			{
//				// per ciascuna chiave trovata inserisce in tabella la coppia (id chiave,gruppo)
//				_foundsetKey.setSelectedIndex(mks);
//				// controlla se la chiave è già stata assegnata per il gruppo in questione altrimenti non la inserisce di nuovo
//				if (!globals.ma_sec_getSecurityKeyForGroup(forms.ma_sec_main_group.group_id, _foundsetKey.security_key_id)) {
//					foundset.newRecord();
//					foundset.security_key_id = _foundsetKey.security_key_id;
//					foundset.group_id = forms.ma_sec_main_group.group_id;
//				}
//			}
//		}
				
		databaseManager.saveData();
		
	} else
		globals.ma_utl_showInfoDialog('Non è stata selezionata alcuna tipologia di menu');
}

