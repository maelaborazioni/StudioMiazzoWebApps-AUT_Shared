/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"7F42540D-09A9-4049-B77A-B5FC42D8AEC1"}
 */
function addRecord(event) 
{
	foundset.newRecord();	
	foundset.owner_id = forms.ma_sec_main.owner_id || globals.svy_sec_lgn_owner_id;
		
//	forms.ma_sec_main_user.controller.focusFirstField();
}

/**
 * Handle record selected.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"856D1389-63B2-4C5C-9E8D-DC337DA8AA90"}
 */
function onRecordSelection(event) 
{
//	sec_user_to_sec_user.loadAllRecords();
	forms.ma_sec_main_user_role.refreshView();	
}

/**
 * Called before the form component is rendered.
 *
 * @param {JSRenderEvent} event the render event
 *
 * @private
 *
 * @properties={typeid:24,uuid:"B851AE27-8CFA-4D97-8A64-6367BBE78BA2"}
 */
function onRenderUserTbl(event)
{
	var rec = event.getRecord();
	var recRen = event.getRenderable();
	var today = globals.TODAY;
	if(rec 
	  && (rec['sec_user_to_sec_user_to_lavoratori.sec_user_to_lavoratori_to_lavoratori.cessazione'] != null 
		  && rec['sec_user_to_sec_user_to_lavoratori.sec_user_to_lavoratori_to_lavoratori.cessazione'] < today))
	{
		recRen.bgcolor = 'gray';
	}
	
	
}
