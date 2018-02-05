
/**
 * Predispone l'associazione del lavoratore ad uno o più ruoli 
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"1F8073EF-4C21-4C1D-A7D6-622E37C1F1D4"}
 */
function addRole(event) {
	forms.ma_sec_main_user_role_tbl.addRecord(event);
}

/**
 *
 * @param {Boolean} _firstShow
 * @param {JSEvent} _event
 *
 * @properties={typeid:24,uuid:"D1CAD504-2F27-4AE7-A3D0-88D521FA576A"}
 * @AllowToRunInFind
 */
function onShowForm(_firstShow, _event)
{
	_super.onShowForm(_firstShow, _event);
	refreshView();
}

/**
 * @AllowToRunInFind
 *
 * @properties={typeid:24,uuid:"7DEB9DC5-B617-4DAC-9950-8861A2CCC561"}
 */
function refreshView()
{
	var _query = 'SELECT user_org_id FROM SEC_USER_IN_GROUP \
				  WHERE USER_ORG_ID IN \
        (SELECT USER_ORG_ID FROM SEC_USER_ORG \
         WHERE USER_ID = ?)';
	var _args = [forms.ma_sec_main_user.user_id];
	var _ds = databaseManager.getDataSetByQuery(globals.Server.SVY_FRAMEWORK,_query,_args,-1);
	
	var _fs = forms.ma_sec_main_user_role_tbl.foundset;
	_fs.find();
	_fs.user_org_id = _ds.getColumnAsArray(1);
	_fs.search();
}
