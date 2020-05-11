/**
 * Associa l'utente ad uno o più gruppi (ruoli)
 * 
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"9419F030-83C3-47FF-BBC3-979703C2F56D"}
 * @AllowToRunInFind
 */
function addRecord(event)
{
	var userId = forms.ma_sec_main_user.user_id;
	
	var _query = 'SELECT sg.group_id \
	              ,so.organization_id \
                  FROM sec_group sg \
                  INNER JOIN sec_organization so \
                  ON sg.owner_id = so.owner_id \
                  INNER JOIN sec_system_group ssg \
                  ON so.organization_id = ssg.for_organization \
                  AND sg.group_id = ssg.group_id \
                  WHERE \
                  so.organization_id IN \
                  (SELECT organization_id FROM sec_user_org \
                   WHERE user_id = ? ) \
                  AND \
                  sg.group_id NOT IN \
                  (SELECT group_id \
                   FROM sec_user_in_group \
                   WHERE user_org_id IN \
                   (SELECT user_org_id \
                    FROM sec_user_org \
                    WHERE user_id = ?) \
                  )';
	var _arguments = [userId,userId];
	var _dataset = databaseManager.getDataSetByQuery(globals.nav_db_framework,_query,_arguments,-1);
	
	if(globals.svy_sec_showSelectionDialog('db:/svy_framework/sec_group',
		                                   _dataset,
										   ['group_id'],
										   ['name'],
										   ['Ruolo da organigramma'],
										   [220],
										   500,
										   true))
	{
		var tempFoundset = forms['svy_sec_selection_dialog_sec_group'].foundset.duplicateFoundSet();
		application.output(tempFoundset['group_id'])
		for (var i = 1; i <= tempFoundset.getSize(); i++) {
			tempFoundset.setSelectedIndex(i);
			
			if (tempFoundset['is_selected'] == 1) 
			{	
				// troviamo l'organizzazione associata al gruppo selezionato (dalla tabella sec_system_group)
				/** @type {JSFoundSet<db:/svy_framework/sec_system_group>}*/
				var fsSystemGr = databaseManager.getFoundSet(globals.Server.SVY_FRAMEWORK,'sec_system_group');
				fsSystemGr.find();
				fsSystemGr.group_id = tempFoundset['group_id'];
				fsSystemGr.search();
				var organizationId = fsSystemGr.for_organization;
				application.output('organization : ' + organizationId)
				
				// troviamo l'user_og_id a partire dall'organizzazione appena ottenuta
				/** @type {JSFoundSet<db:/svy_framework/sec_user_org>}*/
				var fsUserOrg = databaseManager.getFoundSet(globals.Server.SVY_FRAMEWORK,'sec_user_org'); 
				fsUserOrg.find();
				fsUserOrg.user_id = userId;
				fsUserOrg.organization_id = organizationId;
				fsUserOrg.search();
				var userOrgId = fsUserOrg.user_org_id;
				application.output('user_org_id : ' + userOrgId)
				
				// inseriamo il nuovo record
				/** @type {JSFoundSet<db:/svy_framework/sec_user_in_group>}*/
				var fsUserInGr = fsUserOrg.sec_user_org_to_sec_user_in_group//databaseManager.getFoundSet(globals.Server.SVY_FRAMEWORK,'sec_user_in_group');
				if(fsUserInGr && fsUserInGr.newRecord())
				{
					databaseManager.startTransaction();
//					fsUserInGr.user_org_id = userOrgId;
					fsUserInGr.group_id = tempFoundset['group_id'];
					
					if(!databaseManager.commitTransaction())
					{
						databaseManager.rollbackTransaction();
						globals.ma_utl_showErrorDialog('Errore durante il salvataggio del ruolo, si prega di riprovare','Aggiungi ruolo');
					    return;
					}
				}
				else
				{
					databaseManager.rollbackTransaction();
					globals.ma_utl_showErrorDialog('Errore durante la creazione del nuovo record, si prega di riprovare','Aggiungi ruolo');
				    return;
				}
			}
		}
					
	}
	forms.ma_sec_main_user_role.refreshView();
	
}
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"187A82FE-9081-4950-BA81-8007526540C3"}
 */
function deleteRecord(event) 
{
	var sql = "delete from sec_user_in_group SUIG \
               where SUIG.group_id = ?\
               and SUIG.user_in_group_id = ?";
	var success = plugins.rawSQL.executeSQL(globals.Server.SVY_FRAMEWORK,
	                                        sql,
		                                    [foundset.sec_user_org_to_sec_user_in_group.group_id,
		                                    foundset.sec_user_org_to_sec_user_in_group.user_in_group_id]);
	if(success)
		plugins.rawSQL.flushAllClientsCache(globals.Server.SVY_FRAMEWORK,'sec_user_in_group');
	else
		globals.ma_utl_showErrorDialog('Record non eliminato,riprovare','Elimina gruppo utente');
	
	forms.ma_sec_main_user_role.refreshView();
}
