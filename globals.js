/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"79E17B31-57E5-4F9C-B9A0-E43FB5327A72"}
 */
var RestServerLink = ''
	
/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"014F3AC9-D8E5-4232-BAE1-469139D959D8"}
 */
var RfpServerLink = '';

/**
 * @properties={typeid:35,uuid:"C5103CFD-953A-48CF-AE77-6ADE59BB1B6A",variableType:-4}
 */
var is_cas_authenticated = false;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"2C34A6A4-8F81-4DA3-A3BF-533BA40C350C"}
 */
var cas_logout_url = application.getServerURL() + '/cas/logout';

/**
 * @properties={typeid:24,uuid:"FC727157-387D-448B-940C-437ADA37DD04"}
 */
function ma_sec_cas_logout()
{
	application.showURL(cas_logout_url, '_self');
}

/**
 * @properties={typeid:24,uuid:"064A5ADA-65C6-4723-98A8-371050773FAB"}
 */
function ma_sec_logout()
{
	var _solution = null;
	
	if(globals.is_cas_authenticated)
		globals.ma_sec_cas_logout();
	else
		_solution = application.getSolutionName();
	
	// remove cookies info if user doesn't need/want to store them 
	if(!globals.svy_sec_cookies)
	{
		var arrProperties = application.getUserPropertyNames();
		for(var c = 0; c < arrProperties; c++)
			application.setUserProperty(arrProperties[c],null);
	}
	var url = RfpServerLink + "/servoy-webclient/ss/s/" + _solution;
	application.showURL(url,'_self');
	
	security.logout(_solution);
	// in caso non dovesse funzionare, l'istruzione utilizzata finora è application.exit();
}

/**
 * @type {
 * 			{
 *              gruppi : Array,
 * 				lavoratori: Array
 * 			} 
 * 		 }
 *
 * @properties={typeid:35,uuid:"1A1B74EB-C144-45E4-AA92-4907D67960B9",variableType:-4}
 */
var sec = 
{
	gruppi    : [],
	lavoratori: []
}

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"9EB64538-B616-480D-9CE8-EE75EBC450F2",variableType:8}
 */
var ma_sec_lgn_groupid = -1;

/**
 * @param {Object} user_org_id
 * @param {Object} [user_group_id]
 * 
 * @return {Array}
 *
 * @properties={typeid:24,uuid:"AF820DC9-1B8F-4AC2-BE4F-2EB3C9066995"}
 */
function ma_sec_setUserHierarchy(user_org_id,user_group_id)
{
	var sqlQuery = "WITH RECURSIVE hierarchy(organization_id, parent_organization_id) AS\
					(\
						SELECT\
							organization_id,\
							CAST(NULL AS character varying(50)) AS parent_organization_id\
						FROM\
							sec_organization\
						WHERE\
							organization_id = (SELECT organization_id FROM sec_user_org WHERE user_org_id = ?)\
						\
						UNION ALL\
						\
						SELECT\
							soh.organization_id,\
							soh.parent_organization_id\
						FROM\
							sec_organization_hierarchy soh\
							INNER JOIN hierarchy h\
								ON soh.parent_organization_id = h.organization_id\
						WHERE\
							soh.organization_id <> soh.parent_organization_id\
					)\
					SELECT\
						  sutl.user_id\
						, sutl.idlavoratore\
					FROM\
						sec_user_to_lavoratori sutl\
						INNER JOIN sec_user su\
							ON su.user_id = sutl.user_id\
					WHERE\
						su.user_id IN\
						(\
							SELECT DISTINCT\
								suo.user_id\
							FROM\
								sec_user_in_group sug\
								INNER JOIN sec_group sg\
                                    ON sug.group_id = sg.group_id\
								INNER JOIN sec_user_org suo\
									ON suo.user_org_id = sug.user_org_id\
								INNER JOIN hierarchy h\
									ON h.organization_id = suo.organization_id\
								WHERE ";
	
		if(user_group_id && user_group_id != -1)
			sqlQuery += "sug.group_id = " + user_group_id + " AND ";
		
		sqlQuery += "h.organization_id <> (SELECT organization_id FROM sec_user_org WHERE user_org_id = ?)\
									OR\
									sug.user_org_id = ?\
						)\
					ORDER BY\
						su.user_id;";
	
	var dataset = databaseManager.getDataSetByQuery(globals.nav_db_framework, sqlQuery, [user_org_id, user_org_id, user_org_id], -1);
	if (dataset.getMaxRowIndex() > 0)
		globals.sec.lavoratori = dataset.getColumnAsArray(2);
	
	return globals.sec.lavoratori;
}

/**
 * @param {String} ownerID
 * 
 * @return {JSDataSet}
 * 
 * @properties={typeid:24,uuid:"8549DE5F-B69D-46D6-A203-0E1260D1573E"}
 */
function ma_sec_getHierarchy(ownerID)
{
	var sqlHie = 'WITH RECURSIVE hierarchy(organization_id, parent_organization_id) AS \
( \
	SELECT \
		organization_id, \
		CAST(NULL AS character varying(50)) AS parent_organization_id \
	FROM \
		sec_organization_hierarchy \
	WHERE \
		parent_organization_id is null \
	\
	UNION ALL \
	\
	SELECT \
		soh.organization_id, \
		soh.parent_organization_id \
	FROM \
		sec_organization_hierarchy soh \
		INNER JOIN hierarchy h \
			ON soh.parent_organization_id = h.organization_id \
	WHERE \
		soh.organization_id <> soh.parent_organization_id \
) \
select \
	h.organization_id, \
	h.parent_organization_id, \
	so.name, \
	su.name_compound \
from \
	hierarchy h \
	inner join sec_organization so \
		on so.organization_id = h.organization_id \
	inner join sec_user_org suo \
		on suo.organization_id = h.organization_id \
	inner join sec_user su \
		on su.user_id = suo.user_id \
where \
	so.owner_id = ? \
	and \
	su.owner_id = ?'
		
	var arrHie = [ownerID,ownerID];
	var dsHie = databaseManager.getDataSetByQuery(globals.Server.SVY_FRAMEWORK,sqlHie,arrHie,-1);
	
	return dsHie;
	
}

/**
 * @param {String} [organization_ID]
 * @param {Number} [user_ID]
 * 
 * @return {JSDataSet}
 * 
 * @properties={typeid:24,uuid:"5C91B275-21F7-42EE-8817-176C7EAD4B2C"}
 */
function ma_sec_getUserGroups(organization_ID,user_ID)
{
	organization_ID = organization_ID || globals.svy_sec_lgn_organization_id;
	
	// tutti i gruppi come da gerarchia (escluso il proprio gruppo attuale)
	var sqlQuery = "WITH RECURSIVE hierarchy(organization_id, parent_organization_id) AS \
					( \
						SELECT \
							org.organization_id, \
							CAST(NULL AS character varying(50)) AS parent_organization_id \
						FROM \
							sec_organization org \
						WHERE \
							organization_id = ? \
						\
						UNION ALL \
						\
						SELECT \
							soh.organization_id, \
							soh.parent_organization_id \
						FROM \
							sec_organization_hierarchy soh \
							INNER JOIN hierarchy h \
								ON soh.parent_organization_id = h.organization_id \
						WHERE \
							soh.organization_id <> soh.parent_organization_id \
					) \
					SELECT DISTINCT \
						sg.group_id, sg.name \
					FROM \
						sec_user_in_group sug \
						INNER JOIN sec_group sg \
							ON sg.group_id = sug.group_id \
						INNER JOIN sec_user_org suo \
							ON suo.user_org_id = sug.user_org_id \
						LEFT OUTER JOIN sec_system_group ssg \
							ON ssg.group_id = sg.group_id \
							AND ssg.for_organization = suo.organization_id \
						INNER JOIN hierarchy h \
							ON h.organization_id = suo.organization_id \
\
					ORDER BY \
						sg.name;";
	
	var args    = new Array(2);
		args[0] = organization_ID;
//		args[1] = organization_ID;

	var dataset = databaseManager.getDataSetByQuery(globals.nav_db_framework, sqlQuery, args, -1);
	if (dataset.getMaxRowIndex() > 0)
		globals.sec.gruppi = dataset.getColumnAsArray(1);
		
	return dataset;
}

/**
 * Restituisce la gerarchia degli utenti dell'organizzazione indicata ordinandola per
 * livelli di profondit� ed ordina alfabetico
 * 
 * @param {String} organization_id
 * @param {Boolean} [returnIdLavoratori]
 * @param {Boolean} [orderByNominativo]
 * @param {Boolean} [orderByGroup]
 * 
 * @return {Array<Number>}
 * 
 * @properties={typeid:24,uuid:"C8572B5F-8AB9-49E9-A6A4-881468F28201"}
 */
function ma_sec_getUsers(organization_id,returnIdLavoratori,orderByNominativo,orderByGroup)
{
	var sqlQuery = "WITH RECURSIVE hierarchy(organization_id, parent_organization_id,depth) AS \
					( \
						SELECT \
							org.organization_id,\
							CAST(NULL AS character varying(50)) AS parent_organization_id,\
							1 \
						FROM \
							sec_organization org \
						WHERE \
							organization_id = ? \
						UNION ALL \
						SELECT \
							soh.organization_id, \
							soh.parent_organization_id, \
							depth + 1 \
							FROM \
							sec_organization_hierarchy soh \
							INNER JOIN hierarchy h \
								ON soh.parent_organization_id = h.organization_id \
						WHERE \
							soh.organization_id <> soh.parent_organization_id \
					) \
					SELECT \
						sul.idlavoratore,su.user_id, user_name, name_compound, sg.name, depth \
					FROM \
						sec_user_in_group sug \
						INNER JOIN sec_group sg \
							ON sg.group_id = sug.group_id \
						INNER JOIN sec_user_org suo \
							ON suo.user_org_id = sug.user_org_id \
						INNER JOIN sec_user su \
						    ON su.user_id = suo.user_id \
   					    INNER JOIN sec_user_to_lavoratori sul \
					        ON su.user_id = sul.user_id \
						LEFT OUTER JOIN sec_system_group ssg \
							ON ssg.group_id = sg.group_id \
							AND ssg.for_organization = suo.organization_id \
						INNER JOIN hierarchy h \
							ON h.organization_id = suo.organization_id \
					ORDER BY ";
	if(orderByNominativo)
		sqlQuery += "name_compound";
	else if(orderByGroup)
		sqlQuery += "sg.name,depth,name_compound";
	else		
		sqlQuery +=	"depth,sg.name,name_compound";
	
	var args = new Array(1);
	args[0] = organization_id;
	
	var dataset = databaseManager.getDataSetByQuery(globals.nav_db_framework, sqlQuery, args, -1);
	if (dataset.getMaxRowIndex() > 0)
	{
		if(returnIdLavoratori != null && returnIdLavoratori)
	       return dataset.getColumnAsArray(1);
		else
		   return dataset.getColumnAsArray(2);
	}
	else
		return null;
}

/**
 * @properties={typeid:24,uuid:"293D431E-E20B-4EFF-A597-9F406B53E565"}
 */
function ma_sec_onSolutionOpen(arg, queryParams)
{
	databaseManager.setAutoSave(true);
	
	try
	{
		var success;
		
		if(globals.ma_utl_hasModule(globals.Module.AUTORIZZAZIONI))
			success = globals.ma_onSolutionOpen_pre(arg, queryParams);
		else
			success = globals.svy_nav_onOpen(arg, queryParams);
				
		if(!success)
		{
			var msg = i18n.getI18NMessage('ma.msg.no_auth');
			globals.ma_utl_showErrorDialog(msg);
			globals.exitWithError(msg);
			
			return false;
		}
		
		/**
		 * Set the kind of the connection and define the correct client's database
		 */
		var ownerdb = _to_sec_organization$lgn.sec_organization_to_sec_owner && _to_sec_organization$lgn.sec_organization_to_sec_owner.database_name;
		if (ownerdb)
		{
			var clientDB = ownerdb;
			
			_tipoConnessione = globals.Connessione.CLIENTE;
			
			globals.customer_dbserver_name = 'Cliente_' + clientDB;
			globals.customer_db_name = databaseManager.getDataSetByQuery(globals.customer_dbserver_name, "SELECT DB_NAME()", null, -1).getValue(1, 1);
				
			success = 			 databaseManager.switchServer(globals.Server.MA_PRESENZE, customer_dbserver_name);
			success = success && databaseManager.switchServer(globals.Server.MA_ANAGRAFICHE, customer_dbserver_name); 
			// TODO PANNELLO VARIAZIONI
			// success = success && databaseManager.switchServer(globals.Server.MA_RICHIESTE, customer_dbserver_name); 
			
			if(!success)
			{
			    globals.ma_utl_showErrorDialog('i18n:ma.msg.connection_error');
			    globals.exitWithError('Errore durante la connessione al database: ' + customer_dbserver_name);
			    
			    return false;
			}
		}
		else
		{
			_tipoConnessione = globals.Connessione.SEDE;
//			if(_to_sec_user$user_id.flag_super_administrator)
//			    globals.ma_utl_showInfoDialog('Amministratore : connesso in modalità sede');
		}
		
		// utente associato a lavoratore cessato
		var vIdLavoratore = globals.getIdLavoratoreFromUserId(globals.svy_sec_lgn_user_id,globals.svy_sec_lgn_owner_id);
		if(vIdLavoratore && globals.getDataCessazione(vIdLavoratore) != null && globals.getDataCessazione(vIdLavoratore) < globals.TODAY)
		{
			var msg_cessato = 'L\'utente è associato ad un lavoratore che risulta cessato. Comunicarlo al responsabile od eventualmente contattare il servizio di assistenza';
			globals.ma_utl_showErrorDialog(msg_cessato);
			globals.exitWithError(msg_cessato);
			
			return false;
		}
		
		/**
		 * Set an upper limit for valuelist based on years
		 */
		globals.vls_anno_filter_max = globals.TODAY.getFullYear() + 5;
		
		// MODIFY THIS VARIABLE ONLY FOR DEVELOPMENT
		// DEFAULT CASE IS "ENVIRONMENT_CASE = ENVIRONMENT.PRODUCTION";
		ENVIRONMENT_CASE = ENVIRONMENT.PRODUCTION;
 		// MODIFY THIS VARIABLE ONLY FOR DEVELOPMENT
		// DEFAULT CASE IS "WS_DOTNET_CASE = WS_DOTNET.v4";
		WS_DOTNET_CASE = WS_DOTNET.CORE;
		
		/**
		 * Set the url for the request to the webservice based on current environment
		 */
		switch(ENVIRONMENT_CASE)
		{
			// produzione 
			case ENVIRONMENT.PRODUCTION:
				RestServerLink = 'http://srv-epiweb';
				RfpServerLink = 'https://webapp.studiomiazzo.it';
			   	LinkedServer.SRV_SEDE = 'SRV-DB01';
				break;
				
			// test esterno
			case ENVIRONMENT.TEST :		
				RestServerLink = 'http://srv-epiweb-dev';
				RestServerLink = 'http://10.255.255.20'; // non risolve più il nome...
				RfpServerLink = 'http://213.92.43.92:8080';
				LinkedServer.SRV_SEDE = 'SRV-EPIWEB-DEV';
			    break; 
	
			// debug standard
			case ENVIRONMENT.DEBUG :
				RestServerLink = 'http://srv-epiweb-d';
				RfpServerLink = 'http://localhost:8080';
				LinkedServer.SRV_SEDE = 'SRV-DB03\DEVEL';
				break;
				
			// debug VB6
			case ENVIRONMENT.DEBUG_VB6 :
				RestServerLink = 'http://srv-dev-t';
				RfpServerLink = 'http://localhost:8080';
				LinkedServer.SRV_SEDE = 'SRV-DB03\DEVEL';
				break;
				
			// debug diretto su produzione
			case ENVIRONMENT.DEBUG_DIRECT :
				RestServerLink = 'http://srv-epiweb';
				RfpServerLink = 'https://webapp.studiomiazzo.it';
			    LinkedServer.SRV_SEDE = 'SRV-DB03\DEVEL';
			    break;
			    
			// debug locale
			case ENVIRONMENT.DEVELOPING:
				RestServerLink = 'http://localhost:53927';
				RfpServerLink = 'http://localhost:8080';
				LinkedServer.SRV_SEDE = 'SRV-DB03\DEVEL';
			    break;
					    
			default:
			    throw new Error('Casistica ambiente di lavoro non riconosciuta');
			    break;
						
		}
		
		// settaggio url per web service
		switch(ENVIRONMENT_CASE)
		{
			case ENVIRONMENT.PRODUCTION:
			case ENVIRONMENT.DEBUG_DIRECT:
			case ENVIRONMENT.TEST:	
				WS_URL = RestServerLink + '/Leaf_Single';
		        WS_MULTI_URL = RestServerLink + '/Leaf_Multi';
		        WS_PSL_URL = RestServerLink + '/Leaf_PSL';
		        WS_LU_URL = RestServerLink + '/Leaf_LU';
		        WS_REPORT_URL = RestServerLink + '/Leaf_Report';
		        WS_PV_URL = RestServerLink + '/Leaf_PV';
		        WS_RFP_URL = RestServerLink + '/Leaf_RFP';
		        WS_ADMIN_URL = RestServerLink +'/Leaf_Admin';
		        WS_TIMBR_URL = RestServerLink +'/Leaf_Timbrature';
		        WS_EVENTI_URL = RestServerLink +'/Leaf_Eventi';
		        WS_GIORN_URL = RestServerLink +'/Leaf_Giornaliera';
		        WS_STORICO_URL = RestServerLink +'/Leaf_Storico';
		        WS_OP_URL = RestServerLink +'/Leaf_Operations';
		        WS_NL_URL = RestServerLink + '/Leaf_NL';
		        break;
			case ENVIRONMENT.DEBUG_VB6:
			case ENVIRONMENT.DEBUG:
			case ENVIRONMENT.DEBUG_DIRECT:	
				WS_URL = WS_MULTI_URL = WS_PSL_URL = WS_PV_URL = WS_RFP_URL = WS_LU_URL = WS_REPORT_URL = WS_ADMIN_URL = WS_TIMBR_URL = WS_EVENTI_URL = WS_GIORN_URL = WS_STORICO_URL = WS_OP_URL = WS_NL_URL = RestServerLink + '/Leaf_Test';
				break;
			case ENVIRONMENT.DEVELOPING:
				WS_URL = WS_MULTI_URL = WS_PSL_URL = WS_PV_URL = WS_RFP_URL = WS_LU_URL = WS_REPORT_URL = 
				WS_ADMIN_URL = WS_TIMBR_URL = WS_EVENTI_URL = WS_GIORN_URL = WS_STORICO_URL = WS_OP_URL = WS_NL_URL = RestServerLink + '/';
				break;
		}
		
		/**
		 * Imposta i filtri sulle tabelle impostati per l'utente
		 */
		globals.ma_sec_setTableFilters();
		
		/**
		 * Imposta i filtri relativi agli utenti / lavoratori
		 */
		ma_sec_setUsersFilters();
				
		/**
		 * Preimposta e blocca il filtro su ditta se è disponibile una sola ditta
		 */
		if(ma_utl_hasKey(Key.RILEVAZIONE_PRESENZE))
			globals.ma_utl_setCompanyFilter();
	
		/**
		 * Retrieve and run all the modules' onOpen methods
		 */
		globals.ma_utl_runModulesOnOpen(arg);
		
		/**
		 * Log successful registration and access
		 */
//		var organization = _to_sec_organization$lgn.name;
//		var owner        = _to_sec_organization$lgn.sec_organization_to_sec_owner.name;
//		application.output('User (' + security.getUserName() + ',' + organization  + ',' + owner + ') connected',LOGGINGLEVEL.WARNING);
		
		return true;
	}
	catch(ex)
	{
		globals.ma_utl_showErrorDialog('i18n:ma.err.generic_error');
		globals.exitWithError(ex);
		
		return false;
	}
}

/**
 * @properties={typeid:24,uuid:"1B81401F-76D9-4D4E-BF00-B4705C43E15E"}
 */
function ma_utl_runModulesOnOpen(args)
{
	var sqlQuery = "SELECT \
						sm.name \
					FROM sec_owner_in_module som \
					INNER JOIN sec_module sm \
						ON sm.module_id = som.module_id \
					WHERE som.owner_id = ? \
						AND (som.start_date IS NULL OR som.start_date <= ?)\
						AND (som.end_date IS NULL OR som.end_date >= ?)";
				
	var userModules = databaseManager.getDataSetByQuery
	(
		globals.svy_nav_getFrameworkDBName()
		,sqlQuery
		,[globals.svy_sec_lgn_owner_id, new Date(), new Date()]
		,-1
	);
	
	for(var m = 1; m <= userModules.getMaxRowIndex(); m++)
	{
		// Get the module's onOpen method name. The only column is the module's name
		var moduleOnOpen = ['ma', userModules.getValue(m, 1).toLowerCase(), 'onSolutionOpen'].join('_');
		if(globals[moduleOnOpen])
			globals[moduleOnOpen](args);
	}
}

/**
 * @properties={typeid:24,uuid:"F50E173D-3648-4D3D-81E9-80A9ADD070B1"}
 */
function svy_nav_getFrameworkDBName() {
	return globals.Server.SVY_FRAMEWORK;
}

/**
 *	Called by opening the module
 *
 * @author Sanneke Aleman
 * @since 2007-05-24
 *
 * @properties={typeid:24,uuid:"5057A930-7762-4A4B-9962-F13AFE2A7E4D"}
 * @AllowToRunInFind
 */
function ma_onSolutionOpen_pre(arg, queryParams) {
	
	var _userDB, _frameworkDB;
	if(arg) {
		var _args = arg.split("|");

//		_owner_id = _args[0];
		_userDB = _args[1];
		_frameworkDB = _args[2];
	}
	
	forms.svy_nav_fr_postLogin.controller.show()

	// set owner id's
	globals.owner_id = globals.svy_sec_owner_id = globals.svy_sec_lgn_owner_id
	
	//check if we should switch the framework db
	if (globals["svy_nav_getFrameworkDBName"]) {
		//This function is used for people that named their frameworkdb different than "svy_framework"
		globals.nav_db_framework = globals["svy_nav_getFrameworkDBName"]();
		databaseManager.switchServer('svy_framework', globals.nav_db_framework);
		}
	if (_frameworkDB && (_frameworkDB != globals.nav_db_framework)) {
		databaseManager.switchServer(globals.nav_db_framework, _frameworkDB);
	}

	//check if we should switch the user db
	if (_userDB && globals["svy_nav_getUserDBName"] && (_userDB != globals["svy_nav_getUserDBName"]())) {
		//Switch to userdbname that was provided in the deeplink -> overrules userdb set in owner record
		databaseManager.switchServer(globals["svy_nav_getUserDBName"](), _userDB);
	} else {
		//Check if userdb is set in ownerrecord. If so, switch to it. 
		/** @type {JSFoundSet<db:/svy_framework/sec_owner>}*/
		var _fs = databaseManager.getFoundSet(globals.nav_db_framework, "sec_owner");
		_fs.loadRecords(databaseManager.convertToDataSet([globals.svy_sec_owner_id]));
		_userDB = _fs.database_name;
		if (_userDB != null && _userDB != "" && globals["svy_nav_getUserDBName"] && _userDB != globals["svy_nav_getUserDBName"]()) {
			databaseManager.switchServer(globals["svy_nav_getUserDBName"](), _userDB);
		}
	}
	
	//save solution name
	globals.nav_solution_name = application.getSolutionName();
	
	//filter framework_db on solution name if necessary
	if (globals.svy_nav_getBooleanProperty("filter_on_solution_name")) {
		databaseManager.addTableFilterParam(globals.nav_db_framework, null, "solution_name", "=", globals.nav_solution_name, "solution_filter");
	}
	
	//filter data
	// MAVariazione - Don't filter anything if we are super administrators
	/** @type {JSFoundSet<db:/svy_framework/sec_user>} */
	var _foundset = databaseManager.getFoundSet(globals.nav_db_framework, 'sec_user')
	var _rec
	if(_foundset.find())
	{	
		_foundset.user_id = globals.svy_sec_lgn_user_id;
		if(_foundset.search() == 0)
			throw new Error("User not found. Please contact the administrator.");
		
		_rec = _foundset.getRecord(1)	
	} 
	
	if(_rec && !_rec.flag_super_administrator)
	{
		globals.svy_nav_filterOwner(_rec);
		globals.svy_nav_filterOrganization();
	}
	
	databaseManager.setCreateEmptyFormFoundsets()
	
	//run onOpen-method of when available
	if (globals['onOpen']) {
		globals['onOpen']().apply(this, arguments);
	}

	//onPost Login
	if(globals.ma_nav_postLogin(_rec))
	{
		var mainForm = queryParams && queryParams['mainform'];
		if (mainForm)
			forms[mainForm].controller.show();
		
		return true;
	}
	
	return false;
}

/**
 * @properties={typeid:24,uuid:"7D1CFA0D-8FFF-487C-AA7E-31AB13432CC3"}
 * @AllowToRunInFind
 */
function ma_nav_postLogin(_rec) 
{
	forms.svy_nav_fr_loading.setStatusBar(5);
	globals.user_id = globals.svy_sec_lgn_user_id;
	globals.svy_sec_username = security.getUserName();
	
	
	//show open tabs in the framework if the property is set.
	if(globals.svy_nav_getBooleanProperty('show_open_tabs'))
	{
		forms.svy_nav_fr_openTabs.showFormInFramework();
		globals.nav_show_open_tabs = 1
	}
	
	globals.owner_id = globals.svy_sec_owner_id =  globals.svy_sec_lgn_owner_id //_rec.owner_id
 
	//set valuelistOwner id
	if(globals.vlt_owner_id) globals.vlt_owner_id = globals.svy_sec_owner_id
	
	//check if the password is expired
	globals.svy_sec_currentdate = new Date()
	if(!databaseManager.hasRecords(_rec.sec_user_to_sec_user_password$current_date)) //password is expired, show dialog to change password
	{		
		globals.svy_mod_showFormInDialog(forms.svy_sec_password_new_login);
	}
	
	//run onPostLogin-method when available
	if(globals['onPostLogin'])
	   globals['onPostLogin']()
		
	globals.nav = new Object()
	
	_rec.times_wrong_login = null
	
	// set the i18n based on the owner/organization
	if (globals.svy_nav_setI18N) {
		globals.svy_nav_setI18N(globals.svy_sec_lgn_organization_id);
	}

	/**
	 * Retrieve the security keys for the user's hierarchy
	 */
	globals.nav.keys = globals.ma_sec_getSecurityKeys().getColumnAsArray(1).join(',');
	if(!globals.nav.keys || globals.nav.keys.length == 0)
	    return false;
	
	globals.svy_sec_setElementRightsWithKeys();
	
	globals.svy_nav_init();
	forms.svy_nav_fr_loading.setStatusBar(100);
	
	return true;
}

/**
 * @param {Number} 		[user_org_ID]
 * @param {Number} 		[user_ID]
 * @param {String}		[owner_ID]
 * @param {Number}		[group_ID]
 * 
 * @return {JSDataSet}
 * 
 * @properties={typeid:24,uuid:"7D3B2EAB-CB74-4ED6-895C-AF0F446113A2"}
 */
function ma_sec_getSecurityKeys(user_org_ID, user_ID, owner_ID, group_ID)
{
	user_ID     = user_ID     || globals.svy_sec_lgn_user_id;
	owner_ID    = owner_ID    || globals.svy_sec_lgn_owner_id;
	user_org_ID = user_org_ID || globals.svy_sec_lgn_user_org_id;
	group_ID	= group_ID    || globals.ma_sec_lgn_groupid;
	
	var sqlQuery = "SELECT DISTINCT \
						ssk.security_key_id \
					FROM \
						sec_security_key ssk \
						INNER JOIN sec_user_right surd \
							ON surd.security_key_id = ssk.security_key_id \
					WHERE \
						surd.user_right_id IN \
						( \
							WITH RECURSIVE hierarchy(organization_id, parent_organization_id) AS \
							( \
								SELECT \
									organization_id, \
									CAST(NULL AS character varying(50)) AS parent_organization_id \
								FROM \
									sec_organization \
								WHERE \
									organization_id = (SELECT organization_id FROM sec_user_org WHERE user_org_id = ?) \
								\
								UNION ALL \
								\
								SELECT \
									soh.organization_id, \
									soh.parent_organization_id \
								FROM \
									sec_organization_hierarchy soh \
									INNER JOIN hierarchy h \
										ON soh.parent_organization_id = h.organization_id \
								WHERE \
									soh.organization_id <> soh.parent_organization_id \
							) \
							SELECT DISTINCT \
								sur.user_right_id \
							FROM \
								sec_security_key ssk \
								INNER JOIN sec_user_right sur \
									ON ssk.security_key_id = sur.security_key_id \
								INNER JOIN sec_user_in_group sug \
									ON sug.group_id = sur.group_id \
								INNER JOIN sec_user_org suo \
									ON suo.user_org_id = sug.user_org_id \
								LEFT OUTER JOIN sec_system_group ssg \
									ON ssg.group_id = sug.group_id \
									AND ssg.for_organization = suo.organization_id \
								INNER JOIN hierarchy h \
									ON h.organization_id = suo.organization_id \
								WHERE \
									(suo.user_id = ? OR ssg.for_organization IS NULL)\
									AND \
									(sur.is_denied IS NULL OR sur.is_denied = 0 OR sur.user_org_id = ?) \
									AND \
									( \
										ssk.module_id IS NULL OR ssk.module_id IN \
										( \
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
									) \
									AND NOT EXISTS \
									( \
										SELECT * \
										FROM \
											sec_user_right surd \
										WHERE \
											surd.security_key_id = sur.security_key_id \
											AND \
											(surd.user_org_id = ? OR surd.group_id = ?) \
											AND \
											surd.is_denied = 1 \
									) \
							EXCEPT \
							( \
								SELECT \
									sur.user_right_id \
								FROM \
									sec_user_right sur \
									INNER JOIN sec_user_in_group sug \
										ON sug.group_id = sur.group_id \
									LEFT OUTER JOIN sec_system_group ssg \
										ON ssg.group_id = sug.group_id \
								WHERE \
									(-1 <> ? AND sug.group_id <> ? AND ssg.locked IS NULL) \
									AND \
									sug.user_org_id = ? \
							) \
						) \
						OR \
						(surd.user_org_id = ? AND (surd.is_denied IS NULL OR surd.is_denied = 0));";
	
	var args     = new Array(12);
		args[0]  = user_org_ID;
		args[1]  = user_ID;
		args[2]  = user_org_ID;
		args[3]  = owner_ID.toString();
		args[4]  = new Date();
		args[5]  = new Date();
		args[6]  = user_org_ID;
		args[7]  =
		args[8]  = 
		args[9]  = group_ID;
		args[10] = 
		args[11] = user_org_ID;

	var dataset = databaseManager.getDataSetByQuery(globals.nav_db_framework, sqlQuery, args, -1);

	return dataset;
}

/**
 * @param {Number} 		[user_org_ID]
 * @param {Number} 		[user_ID]
 * @param {String}		[owner_ID]
 * @param {Number}		[group_ID]
 * 
 * @return {JSDataSet}
 * 
 * @properties={typeid:24,uuid:"C8A3D796-8815-4844-BC5A-B06322AB6911"}
 */
function ma_sec_getAvailableSecurityKeys(user_org_ID, user_ID, owner_ID, group_ID)
{
	user_ID     = user_ID     || globals.svy_sec_lgn_user_id;
	owner_ID    = owner_ID    || globals.svy_sec_lgn_owner_id;
	user_org_ID = user_org_ID || globals.svy_sec_lgn_user_org_id;
	group_ID	= group_ID    || globals.ma_sec_lgn_groupid;
	
	var sqlQuery = "SELECT security_key_id FROM sec_security_key\
	                WHERE security_key_id NOT IN (\
	                SELECT DISTINCT \
						ssk.security_key_id \
					FROM \
						sec_security_key ssk \
						INNER JOIN sec_user_right surd \
							ON surd.security_key_id = ssk.security_key_id \
					WHERE \
						surd.user_right_id IN \
						( \
							WITH RECURSIVE hierarchy(organization_id, parent_organization_id) AS \
							( \
								SELECT \
									organization_id, \
									CAST(NULL AS character varying(50)) AS parent_organization_id \
								FROM \
									sec_organization \
								WHERE \
									organization_id = (SELECT organization_id FROM sec_user_org WHERE user_org_id = ?) \
								\
								UNION ALL \
								\
								SELECT \
									soh.organization_id, \
									soh.parent_organization_id \
								FROM \
									sec_organization_hierarchy soh \
									INNER JOIN hierarchy h \
										ON soh.parent_organization_id = h.organization_id \
								WHERE \
									soh.organization_id <> soh.parent_organization_id \
							) \
							SELECT DISTINCT \
								sur.user_right_id \
							FROM \
								sec_security_key ssk \
								INNER JOIN sec_user_right sur \
									ON ssk.security_key_id = sur.security_key_id \
								INNER JOIN sec_user_in_group sug \
									ON sug.group_id = sur.group_id \
								INNER JOIN sec_user_org suo \
									ON suo.user_org_id = sug.user_org_id \
								LEFT OUTER JOIN sec_system_group ssg \
									ON ssg.group_id = sug.group_id \
									AND ssg.for_organization = suo.organization_id \
								INNER JOIN hierarchy h \
									ON h.organization_id = suo.organization_id \
								WHERE \
									(suo.user_id = ? OR ssg.for_organization IS NULL)\
									AND \
									(sur.is_denied IS NULL OR sur.is_denied = 0 OR sur.user_org_id = ?) \
									AND \
									( \
										ssk.module_id IS NULL OR ssk.module_id IN \
										( \
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
									) \
									AND NOT EXISTS \
									( \
										SELECT * \
										FROM \
											sec_user_right surd \
										WHERE \
											surd.security_key_id = sur.security_key_id \
											AND \
											(surd.user_org_id = ? OR surd.group_id = ?) \
											AND \
											surd.is_denied = 1 \
									) \
							EXCEPT \
							( \
								SELECT \
									sur.user_right_id \
								FROM \
									sec_user_right sur \
									INNER JOIN sec_user_in_group sug \
										ON sug.group_id = sur.group_id \
									LEFT OUTER JOIN sec_system_group ssg \
										ON ssg.group_id = sug.group_id \
								WHERE \
									(-1 <> ? AND sug.group_id <> ? AND ssg.locked IS NULL) \
									AND \
									sug.user_org_id = ? \
							) \
						) \
						OR \
						(surd.user_org_id = ? AND (surd.is_denied IS NULL OR surd.is_denied = 0))\
						)\
						AND owner_id = ?"
	
	// aggiunta per poter bloccare l'invio di mail di richiesta ferie e permessi verso una coppia utente - gruppo di appartenenza 
	sqlQuery +=" OR name = 'Non ricevere mail'";
	
	var args     = new Array(12);
		args[0]  = user_org_ID;
		args[1]  = user_ID;
		args[2]  = user_org_ID;
		args[3]  = owner_ID.toString();
		args[4]  = new Date();
		args[5]  = new Date();
		args[6]  = user_org_ID;
		args[7]  =
		args[8]  = 
		args[9]  = group_ID;
		args[10] = 
		args[11] = user_org_ID;
        args[12] = owner_ID.toString();
		
	var dataset = databaseManager.getDataSetByQuery(globals.nav_db_framework, sqlQuery, args, -1);

	return dataset;
}

/**
 * @properties={typeid:24,uuid:"75201A04-125E-4C1B-A24E-F5232D4E00C6"}
 */
function ma_sec_setSecurityFilters(userid, ownerid)
{
	// Consider also the current user when she does not belong to the login owner
	databaseManager.removeTableFilterParam(globals.nav_db_framework, 'owner_filter_sec_user');
	
	var sqlQuery = "SELECT \
						su.user_id \
					FROM \
						sec_user su \
					WHERE \
						su.user_id = ? OR su.owner_id = ?;";
	
	var users = databaseManager.getDataSetByQuery(globals.nav_db_framework, sqlQuery, [userid, ownerid], -1).getColumnAsArray(1);
	databaseManager.addTableFilterParam(globals.nav_db_framework, 'sec_user', 'user_id', 'IN', users, 'owner_filter_sec_user');
		
	globals.ma_sec_hideAnotherOwnerUsers(globals.svy_sec_lgn_owner_id);
}

/**
 * Hide users which belong to another owner
 * 
 * @param {String} lgn_owner_id
 *
 * @properties={typeid:24,uuid:"5E2DB572-D0AA-4959-9669-C0DCAC4EFE12"}
 */
function ma_sec_hideAnotherOwnerUsers(lgn_owner_id)
{
	var availableLogins = databaseManager.getDataSetByQuery
	(
			  globals.nav_db_framework
			, "SELECT \
			 		suo.user_org_id \
			   FROM \
			   		sec_user_org suo \
			   		INNER JOIN sec_organization so \
			   			ON so.organization_id = suo.organization_id \
			   		INNER JOIN sec_user su \
			   			ON su.user_id = suo.user_id \
					WHERE \
						su.owner_id = ? \
					AND \
						so.owner_id = ?;"
			, [lgn_owner_id, lgn_owner_id]
			, -1
	).getColumnAsArray(1);
		
//	databaseManager.removeTableFilterParam(globals.nav_db_framework,'ftr_user_org_login_owner');
//	databaseManager.removeTableFilterParam(globals.nav_db_framework,'ftr_user_in_group_login_owner');
	
	databaseManager.addTableFilterParam
	(
			  globals.nav_db_framework
			, 'sec_user_org'
			, 'user_org_id'
			, globals.ComparisonOperator.IN
			, availableLogins
			, 'ftr_user_org_login_owner'
	);
	
	databaseManager.addTableFilterParam
	(
			  globals.nav_db_framework
			, 'sec_user_in_group'
			, 'user_org_id'
			, globals.ComparisonOperator.IN
			, availableLogins
			, 'ftr_user_in_group_login_owner'
	);
}

/**
*
* @properties={typeid:24,uuid:"097B453C-8896-471B-A18E-93749DEFD434"}
* @SuppressWarnings(wrongparameters)
 */
function ma_sec_setTableFilters() {
	// query all the element right from the sec_tables
	var server = globals.nav_db_framework
	var sqlQuery = 'SELECT \
						table_filter_id \
						FROM 		sec_table_filter \
						WHERE 		security_key_id IN (' + globals.nav.keys + ') \
						ORDER BY 	owner_id, server_name, table_name, filter_field_name;'

	/** @type {JSFoundSet<db:/svy_framework/sec_table_filter>} */
	var fs = databaseManager.getFoundSet(server, 'sec_table_filter');
	fs.loadRecords(sqlQuery);
	
	var rec, 
		last_owner, 
		last_server, 
		last_table, 
		last_field,
		last_filter;
	
	/** @type {Array<String>}*/
    var value;

	for (var i = 1; i <= fs.getSize(); i++) 
	{
		rec = fs.getRecord(i);
		
		/**
		 * Filters belonging to a specific owner need to be put in OR instead of AND
		 */
		var key_owner_id = rec.sec_table_filter_to_sec_security_key.owner_id; 
		if (key_owner_id)
		{
			var split_value = rec.filter_value.split(',');

			/**
			 * Concat filters until they apply to the same table and column for the same owner
			 */
			var isSameFilter = 	   last_owner  === key_owner_id 
								&& last_server === rec.server_name 
								&& last_table  === rec.table_name 
								&& last_field  === rec.filter_field_name
								&& last_filter === rec.filter_operator;
								
			if (isSameFilter)
			{
				value = value.concat(split_value);
				
				/**
				 * Add the filter directly if it's the last one
				 */
				if(i === fs.getSize())
					databaseManager.addTableFilterParam
					(
						  last_server
						, last_table
						, last_field
						, last_filter//globals.ComparisonOperator.IN
						, value
						, ['ftr_dati_login', last_server, last_table, last_field, last_owner.toString()].join('_')
					);
			}
			else
			{
				value = split_value;
				
				last_owner  = key_owner_id;
				last_server = rec.server_name;
				last_table  = rec.table_name;
				last_field  = rec.filter_field_name;
				last_filter = rec.filter_operator;
				
				/**
				 * Add the filter if it's complete or the last one
				 */
				if(i > 1 || i === fs.getSize())
					databaseManager.addTableFilterParam
					(
						  last_server
						, last_table
						, last_field
						, last_filter//globals.ComparisonOperator.IN
						, value
						, ['ftr_dati_login', last_server, last_table, last_field, last_owner.toString()].join('_')
					);
			}			
		}
		else
		{
			if (/globals\./.test(rec.filter_value))
			{
				var _global = rec.filter_value.match(/(globals\.\w*)/)[0];
				value = rec.filter_value.replace(/(globals\.\w*)/, eval(_global));
			}
			else
			{
				// MAVariazione - check for comma separated values when using IN
				var _split_value = rec.filter_value.split(',');
				if(_split_value.length > 0)
					value = _split_value;
				else
					value = rec.filter_value;
			}
			
			databaseManager.addTableFilterParam(rec.server_name, rec.table_name, rec.filter_field_name, rec.filter_operator, value, rec.name);
		}
	}
}

/**
 * @properties={typeid:24,uuid:"7E1ACFB3-85DC-4E28-85D6-26AB5AA88984"}
 */
function ma_sec_removeUsersFilters()
{
	databaseManager.removeTableFilterParam(globals.Server.MA_ANAGRAFICHE,
                                           'ftr_dati_lavoratori_gerarchia');
	
	ma_sec_removeDataFilters();
}

/**
 * @properties={typeid:24,uuid:"16873ADE-D310-4B2A-8F4A-CA513C4A5B98"}
 */
function ma_sec_removeDataFilters()
{
	databaseManager.removeTableFilterParam(globals.Server.SVY_FRAMEWORK,'ftr_dati_ditte_incluse');
	databaseManager.removeTableFilterParam(globals.Server.SVY_FRAMEWORK,'ftr_dati_ditte_escluse');
	databaseManager.removeTableFilterParam(globals.Server.SVY_FRAMEWORK,'ftr_dati_lavoratori_inclusi');
	databaseManager.removeTableFilterParam(globals.Server.SVY_FRAMEWORK,'ftr_dati_lavoratori_esclusi');
	databaseManager.removeTableFilterParam(globals.Server.SVY_FRAMEWORK,'ftr_dati_lavoratori_testa_inclusi');
	databaseManager.removeTableFilterParam(globals.Server.SVY_FRAMEWORK,'ftr_dati_lavoratori_testa_esclusi');
}

/**
 * Imposta dei filtri sulla tabella lavoratori secondo quanto specificato dall'utente.
 * I filtri disponibili (in inclusione od esclusione) includono
 * <ul>
 * 	<li>ditta di appartenenza</li>
 * 	<li>sede di lavoro</li>
 * 	<li>raggruppamento di appartenenza</li>
 * 	<li>gruppo di appartenenza</li>
 * </ul>
 * 
 * @properties={typeid:24,uuid:"AFA4C321-D95E-4A7F-A2EE-ADC123F1F3FC"}
 */
function ma_sec_setDataFilters()
{
	// rimuovi eventuali filtri precedenti per partire da una situazione pulita
	ma_sec_removeDataFilters();
	
	// imposta i filtri (se esistono) relativi alle ditte
	var ditte_incluse = [], ditte_escluse = [];
	
	var sqlDitteQuery = "SELECT DISTINCT \
	                     idDitta \
	                     FROM Sec_FiltriDitte \
	                     WHERE security_key_id IN (" + globals.nav.keys + ") \
	                     AND exclude = ?";
							 
	/**
	 * Popola l'array delle ditte da includere
	 */
	var dataset  = databaseManager.getDataSetByQuery(globals.Server.MA_FRAMEWORK, sqlDitteQuery, [0], -1);
	if (dataset && dataset.getMaxRowIndex() > 0)
		ditte_incluse = dataset.getColumnAsArray(1);
	
	/**
	 * Popola l'array delle ditte da escludere
	 */
	   dataset = databaseManager.getDataSetByQuery(globals.Server.MA_FRAMEWORK, sqlDitteQuery, [1], -1);
	if(dataset && dataset.getMaxRowIndex() > 0)
		ditte_escluse = dataset.getColumnAsArray(1);
	
	// imposta i filtri (se esistono) relativi ai lavoratori
	var lavoratori_inclusi = [], lavoratori_esclusi = [];
	
	var sqlQuery = "SELECT DISTINCT \
						idLavoratore \
					FROM \
						V_Sec_FiltriLavoratori \
					WHERE \
						idChiave IN(" + globals.nav.keys + ") \
						AND exclude = ?;"
		
	/**
	 * Popola l'array dei lavoratori da includere
	 */
	dataset  = databaseManager.getDataSetByQuery(globals.getSwitchedServer(globals.Server.MA_FRAMEWORK), sqlQuery, [0], -1);
	if (dataset && dataset.getMaxRowIndex() > 0)
		lavoratori_inclusi = dataset.getColumnAsArray(1);
	
	/**
	 * Popola l'array dei lavoratori da escludere
	 */
	   dataset = databaseManager.getDataSetByQuery(globals.getSwitchedServer(globals.Server.MA_FRAMEWORK), sqlQuery, [1], -1);
	if(dataset && dataset.getMaxRowIndex() > 0)
		lavoratori_esclusi = dataset.getColumnAsArray(1);
		
	// imposta i filtri (se esistono) relativi alle/i organizzazioni/gruppi dell'organigramma
	sqlQuery = "SELECT distinct\
					sutl.idLavoratore\
				FROM\
					sec_group_filter sgf\
					INNER JOIN sec_user_in_group sug\
						ON sug.group_id = sgf.group_id\
					INNER JOIN sec_user_org suo\
						ON suo.user_org_id = sug.user_org_id\
					INNER JOIN sec_user_to_lavoratori sutl\
						ON sutl.user_id = suo.user_id\
					WHERE\
						sgf.security_key_id IN(" + globals.nav.keys + ")\
						AND sgf.exclude = ?;"
						
	/**
	 * Aggiungi i filtri sulle/i organizzazioni/gruppi servoy in inclusione
	 */
	dataset = databaseManager.getDataSetByQuery(globals.Server.SVY_FRAMEWORK, sqlQuery, [0], -1);
	if(dataset && dataset.getMaxRowIndex() > 0)
		lavoratori_inclusi = lavoratori_inclusi.concat(dataset.getColumnAsArray(1));
	
	/**
	 * Aggiungi i filtri sui gruppi servoy in esclusione
	 */
	dataset = databaseManager.getDataSetByQuery(globals.Server.SVY_FRAMEWORK, sqlQuery, [1], -1);
	if(dataset && dataset.getMaxRowIndex() > 0)
		lavoratori_esclusi = lavoratori_esclusi.concat(dataset.getColumnAsArray(1));
	
	/**
	 * Applica i filtri
	 */
	if(ditte_incluse && ditte_incluse.length)
		databaseManager.addTableFilterParam
		(
			globals.Server.MA_ANAGRAFICHE,
			globals.Table.DITTE,
			'idditta',
			globals.ComparisonOperator.IN,
			ditte_incluse,
			'ftr_dati_ditte_incluse'
		);
	
	if(ditte_escluse && ditte_escluse.length)
		databaseManager.addTableFilterParam
		(
			globals.Server.MA_ANAGRAFICHE,
			globals.Table.DITTE,
			'idditta',
			globals.ComparisonOperator.NIN,
			ditte_escluse,
			'ftr_dati_ditte_escluse'
		);
	
	if(lavoratori_inclusi && lavoratori_inclusi.length > 0)
	{
		databaseManager.addTableFilterParam
		(
			globals.Server.MA_ANAGRAFICHE,
			globals.Table.LAVORATORI,
			'idlavoratore',
			globals.ComparisonOperator.IN,
			lavoratori_inclusi,
			'ftr_dati_lavoratori_inclusi'
		);
		
		databaseManager.addTableFilterParam
		(
			globals.Server.MA_ANAGRAFICHE,
			globals.Table.RP_TESTA,
			'idlavoratore',
			globals.ComparisonOperator.IN,
			lavoratori_inclusi,
			'ftr_dati_lavoratori_testa_inclusi'
		);
	}
	
	if(lavoratori_esclusi && lavoratori_esclusi.length > 0)
	{	
		databaseManager.addTableFilterParam
		(
			globals.Server.MA_ANAGRAFICHE,
			globals.Table.LAVORATORI,
			'idlavoratore',
			globals.ComparisonOperator.NIN,
			lavoratori_esclusi,
			'ftr_dati_lavoratori_esclusi'
		);
		databaseManager.addTableFilterParam
		(
			globals.Server.MA_ANAGRAFICHE,
			globals.Table.RP_TESTA,
			'idlavoratore',
			globals.ComparisonOperator.NIN,
			lavoratori_esclusi,
			'ftr_dati_lavoratori_testa_esclusi'
		);
	}
}

/**
 * @properties={typeid:24,uuid:"9E4241C3-E7B5-4BCE-AB77-3D99E515C818"}
 */
function ma_sec_showSecurityDialog()
{
	var form = globals.ma_utl_hasModule(globals.Module.AUTORIZZAZIONI) ? forms.ma_sec_main : forms.ma_sec_main_filter;
	globals.ma_utl_showFormInDialog(form.controller.getName(), 'Autorizzazioni');
}

/**
 * @param {Number} group_id
 * @param {Number} key_id
 * 
 * @properties={typeid:24,uuid:"8E162A0F-4D96-47D6-B5CF-A624CCB1A14D"}
 * @AllowToRunInFind
 */
function ma_sec_getSecurityKeyForGroup(group_id,key_id)
{
	/** @type {JSFoundSet<db:/svy_framework/sec_user_right>}*/
	var fs = databaseManager.getFoundSet(globals.Server.SVY_FRAMEWORK,'sec_user_right');
	if(fs.find())
	{
		fs.group_id = group_id;
		fs.security_key_id = key_id;
		if(fs.search())
		   return true; 
	}
	
	return false;
	
}

/**
 * Cambia la password dell'utente
 * 
 * @properties={typeid:24,uuid:"6235D886-6F41-43C0-83F8-FC297B142290"}
 */
function ma_sec_changeYourPassword()
{
	var frm = forms.ma_sec_password_new;
	frm.vChkGestore = false;
	globals.svy_mod_showFormInDialog(frm, null, null, null, null, null, true, false, 'svy_sec_password_new');
}

/**
 * @properties={typeid:24,uuid:"81DE2AC6-39E5-4289-A41D-AEED5563F655"}
 */
function ma_sec_setUsersFilters()
{
	/**
	 * If logged in as a customer, filter data so the user can only tinker with 
	 * its owner's settings, unless he's super administrator.
	 */
	if(!_to_sec_user$user_id.flag_super_administrator)
	{
		// Application of filters
		if(!globals.ma_utl_hasKey(globals.Key.AUT_GESTORE))
		{
			// Apply filters on the framework
			globals.ma_sec_setSecurityFilters(globals.svy_sec_lgn_user_id, globals.svy_sec_lgn_owner_id);
		
			// Apply filters on employees
		    globals.ma_sec_setDataFilters();
		
		    // Apply filters on employees based on the company's (complete) hierarchy 
		    if(globals.ma_utl_hasModule(globals.Module.AUTORIZZAZIONI)
		       && globals.ma_utl_hasKey(globals.Key.AUT_GERARCHIA))
		    {
				databaseManager.removeTableFilterParam(globals.Server.MA_ANAGRAFICHE,
					                                  'ftr_dati_lavoratori_gerarchia')
				
				databaseManager.addTableFilterParam
				(
					globals.Server.MA_ANAGRAFICHE,
					globals.Table.LAVORATORI,
					'idlavoratore',
					globals.ComparisonOperator.IN,
					globals.ma_sec_setUserHierarchy(globals.svy_sec_lgn_user_org_id,
						                            globals.ma_sec_lgn_groupid),
					'ftr_dati_lavoratori_gerarchia'
				);   
		    }
		}	
		
		// Security tab is only accessible by administrators
//		var secFrm = forms.ma_sec_main_user;
//		secFrm.elements.lbl_security.visible = false;
//		secFrm.elements.tab_security.visible = false;
//		secFrm.elements.tab_left_security.visible = false;
//		secFrm.elements.tab_right_security.visible = false;
	}
}

/**
 * FIltra i gruppi di chiavi selezionabili dall'utente 
 * in base al proprietario
 *
 * @param fs
 * @AllowToRunInFind 
 * @properties={typeid:24,uuid:"BAE29183-C62E-47A8-AB32-440FB9253F5E"}
 */
function FilterGroupKey(fs)
{
	if(!_to_sec_user$user_id.flag_super_administrator)
	{
	   fs.addFoundSetFilterParam('admin_only','=',false);
	   var sqlKeyModuleOwner = 'SELECT sec_security_key_group_id \
                                FROM \
                                sec_security_key ssk \
                                WHERE \
                                ssk.module_id IN \
                                (SELECT \
                                module_id \
                                FROM \
                                sec_owner_in_module soim \
                                WHERE \
                                soim.owner_id = ?) \
                                OR ssk.is_client = 1 \
                                AND ssk.owner_id = ?';
	   var arrKeyModuleOwner = [globals.svy_sec_lgn_owner_id,globals.svy_sec_lgn_owner_id]; //_to_sec_user$user_id.owner_id.toString()];
	   var dsKeyModuleOwner = databaseManager.getDataSetByQuery(globals.Server.SVY_FRAMEWORK,sqlKeyModuleOwner,arrKeyModuleOwner,-1);
	   
	   if(dsKeyModuleOwner && dsKeyModuleOwner.getMaxRowIndex() > 0)
	   {
		   fs.addFoundSetFilterParam('sec_security_key_group_id','IN',dsKeyModuleOwner.getColumnAsArray(1));
	   }
	}
	return fs;
	
}
/**
 * @AllowToRunInFind
 * 
 * @param {String} organizationID
 * 
 * @return {Array<Number>}
 * 
 * @properties={typeid:24,uuid:"D172D239-6CAB-4A16-ADC2-9D05E8B0F8DE"}
 */
function getRpGroups(organizationID)
{
	/** @type {Array<Number>} */
	var arrRpGroups = [];
	/** @type {JSFoundSet<db:/svy_framework/sec_organization_to_rp_group>} */
	var fs = databaseManager.getFoundSet(globals.Server.SVY_FRAMEWORK,'sec_organization_to_rp_group');
	if(fs.find())
	{
		fs.organization_id = organizationID;
		if(fs.search())
			arrRpGroups = globals.foundsetToArray(fs,'rp_group_id');
	}
	
	return arrRpGroups;
}

/**
 * @AllowToRunInFind
 * 
 * @param {String} organizationID
 * 
 * @return {Array<Number>}
 * 
 * @properties={typeid:24,uuid:"FBCF44F5-3C97-47A8-A366-99BCBE7615E7"}
 */
function getRpUsers(organizationID)
{
	/** @type {Array<Number>} */
	var arrRpUsers = [];
	/** @type {JSFoundSet<db:/svy_framework/sec_organization_to_rp_user>} */
	var fs = databaseManager.getFoundSet(globals.Server.SVY_FRAMEWORK,'sec_organization_to_rp_user');
	if(fs.find())
	{
		fs.organization_id = organizationID;
		if(fs.search())
		   arrRpUsers = globals.foundsetToArray(fs,'rp_user_id');
	}
	
	return arrRpUsers;
}

/**
 * @AllowToRunInFind
 * 
 * @param {String} organizationID
 * 
 * @return {JSFoundSet<db:/svy_framework/sec_organization_to_rp_group>}
 * 
 * @properties={typeid:24,uuid:"75684F7A-DD7F-4DE5-BC34-A397C2D40D5E"}
 */
function getRpGroupsInfo(organizationID)
{
	/** @type {JSFoundSet<db:/svy_framework/sec_organization_to_rp_group>} */
	var fs = databaseManager.getFoundSet(globals.Server.SVY_FRAMEWORK,'sec_organization_to_rp_group');
	if(fs.find())
	{
		fs.organization_id = organizationID;
		if(fs.search())
			return fs;
	}
	
	return null;
}

/**
 * @AllowToRunInFind
 * 
 * @param {String} organizationID
 * 
 * @return {JSFoundSet<db:/svy_framework/sec_organization_to_rp_user>}
 *
 * @properties={typeid:24,uuid:"1B449DD4-D49A-48D9-B5E1-1AF083019A52"}
 */
function getRpUsersInfo(organizationID)
{
	/** @type {JSFoundSet<db:/svy_framework/sec_organization_to_rp_user>} */
	var fs = databaseManager.getFoundSet(globals.Server.SVY_FRAMEWORK,'sec_organization_to_rp_user');
	if(fs.find())
	{
		fs.organization_id = organizationID;
		if(fs.search())
			return fs;
	}
	
	return null;
}

/**
 * @AllowToRunInFind 
 * 
 * @param {String} organizationID
 *
 * @return {Array<Number>} 
 * 
 * @properties={typeid:24,uuid:"152B49C8-63F0-4DCC-938D-6119BDCFE3BB"}
 */
function getOrganizationUsers(organizationID)
{
	var sqlOrgUsers = "SELECT \
						su.user_id \
						FROM sec_user su \
						INNER JOIN sec_user_org suo \
						ON suo.user_id = su.user_id \
						INNER JOIN sec_organization so \
						ON suo.organization_id = so.organization_id \
						WHERE so.organization_id = ?";
	var arrOrgUsers = [organizationID];
	var dsOrgUsers = databaseManager.getDataSetByQuery(globals.Server.SVY_FRAMEWORK,sqlOrgUsers,arrOrgUsers,-1);
	
	return dsOrgUsers.getColumnAsArray(1);
}


/**
 * 
 * @param {String} organizationID
 *
 * @return {JSDataSet}
 * 
 * @properties={typeid:24,uuid:"63F2BC2A-499B-46EA-9504-F7263DBC04A0"}
 */
function getOrganizationUsersInfo(organizationID)
{
	var sqlOrgUsers = "SELECT \
						su.user_id, \
						su.name_compound, \
						su.owner_id \
						FROM sec_user su \
						INNER JOIN sec_user_org suo \
						ON suo.user_id = su.user_id \
						INNER JOIN sec_organization so \
						ON suo.organization_id = so.organization_id \
						WHERE so.organization_id = ?";
	var arrOrgUsers = [organizationID];
	var dsOrgUsers = databaseManager.getDataSetByQuery(globals.Server.SVY_FRAMEWORK,sqlOrgUsers,arrOrgUsers,-1);
	
	return dsOrgUsers;
}

/**
 * @AllowToRunInFind
 * 
 * Restituisce l'identificativo della organizzazione da cui dipende l'organizzazione specificata
 * 
 * @param {String} organizationID
 *
 * @properties={typeid:24,uuid:"5FFBC2F3-A15C-451C-BAD3-C2ACC348F424"}
 */
function getParentOrganization(organizationID)
{
	/** @type {JSFoundSet<db:/svy_framework/sec_organization_hierarchy>}*/
	var fs = databaseManager.getFoundSet(globals.Server.SVY_FRAMEWORK,'sec_organization_hierarchy');
	if(fs.find())
	{
		fs.organization_id = organizationID;
		if(fs.search())
			return fs.parent_organization_id;
	}
	
	return null;
}

/**
 * @AllowToRunInFind
 * 
 * Restituisce il nome della organizzazione dell'organizzazione specificata
 * 
 * @param {String} organizationID
 *
 * @properties={typeid:24,uuid:"39D77224-D319-4757-AB44-7C070DD579E0"}
 */
function getOrganizationName(organizationID)
{
	/** @type {JSFoundSet<db:/svy_framework/sec_organization>}*/
	var fs = databaseManager.getFoundSet(globals.Server.SVY_FRAMEWORK,'sec_organization');
	if(fs.find())
	{
		fs.organization_id = organizationID;
		if(fs.search())
			return fs.name;
	}
	
	return '';
}

/**
 * @AllowToRunInFind
 * 
 * Restituisce il nome del gruppo 
 * 
 * @param {Number} groupId
 *
 * @properties={typeid:24,uuid:"B0FDF7E6-4F5D-41E5-894C-A3B7078510E8"}
 */
function getGroupName(groupId)
{
	/** @type {JSFoundSet<db:/svy_framework/sec_group>}*/
	var fs = databaseManager.getFoundSet(globals.Server.SVY_FRAMEWORK,'sec_group');
	if(fs.find())
	{
		fs.group_id = groupId;
		if(fs.search())
			return fs.name;
	}
	
	return '';
}

/**
 * Recupera i lavoratori appartenenti allo stesso livello gerarchico di un nodo foglia
 * 
 * @param {Number} user_org_id
 *
 * @properties={typeid:24,uuid:"CD39C0BE-9789-46EB-A1D2-51D1D01513CE"}
 */
function getLavoratoriLivelloGerarchico(user_org_id)
{
	var sqlQuery = "SELECT\
                    sutl.user_id,\
                    sutl.idlavoratore\
                    FROM\
                    sec_user_to_lavoratori sutl\
                    INNER JOIN sec_user su\
                    ON su.user_id = sutl.user_id\
                    WHERE\
                    su.user_id IN\
                    (SELECT DISTINCT\
                      suo.user_id\
                     FROM\
                      sec_user_in_group sug\
                     INNER JOIN sec_group sg\
                     ON sug.group_id = sg.group_id\
                     INNER JOIN sec_user_org suo\
                     ON suo.user_org_id = sug.user_org_id\
                     WHERE suo.organization_id\
                     IN\
                     (SELECT organization_id FROM sec_user_org WHERE user_org_id = ?)\
                     )\
                     ORDER BY\
                     su.user_id";
		
	var dataset = databaseManager.getDataSetByQuery(globals.nav_db_framework,sqlQuery,[user_org_id],-1);
	return dataset.getColumnAsArray(2);
	
}

/**
 * Recupera i lavoratori appartenenti ad un dato gruppo
 * 
 * @param {Number} user_group_id 
 * @param {String} [user_owner_id]
 * 
 * @return {Array<Number>}
 * 
 * @properties={typeid:24,uuid:"E3E9F294-BDF6-420D-B652-B50E81DBE185"}
 */
function getLavoratoriReparto(user_group_id,user_owner_id)
{
	var arrQuery = [];
	var sqlQuery = "select \
                    sul.user_id, sul.idlavoratore \
                    from \
                    sec_user_in_group sug \
                    inner join sec_user_org suo \
                    on suo.user_org_id = sug.user_org_id \
                    inner join sec_user_to_lavoratori sul \
                    on sul.user_id = suo.user_id \
                    inner join sec_user su \
                    on sul.user_id = su.user_id \
                    where ";
     if(user_group_id != -1) 
     {
        sqlQuery += " group_id = ? ";
        arrQuery.push(user_group_id);
     }
     else
     {
    	 sqlQuery += " group_id in (select group_id from sec_group where owner_id = ?) "
         arrQuery.push(user_owner_id); 
     }
	 sqlQuery += " order by su.name_last,su.name_first_names";

    var dataset = databaseManager.getDataSetByQuery(globals.nav_db_framework, sqlQuery, arrQuery, -1);
    return dataset.getColumnAsArray(2);

}