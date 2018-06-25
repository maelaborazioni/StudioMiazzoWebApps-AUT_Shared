/**
 * @type {Number}
 * 
 * @properties={typeid:35,uuid:"05C5D0FD-7976-4CDB-8403-9EDF6B0C422F",variableType:4}
 */
var vCompanyID = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"5DD51AC8-4E02-4687-9F04-7AF4A32CED4E",variableType:4}
 */
var vChkAttivi = 1;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"9F15DD33-014B-435B-A7F7-EDE5F0ACB912",variableType:4}
 */
var vChkDaAssociare = 0;

/**
 * Handle record selected.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"53CA4F90-4ACE-425E-BCBF-45312E58B660"}
 */
function onRecordSelection(event) 
{
	enableDisableOwnerID();
	
	if (!foundset.flag_system_administrator && !foundset.flag_super_administrator) {
		administratorLevel = null;
	} else {
		if (foundset.flag_system_administrator == 1)
			administratorLevel = 1;
		if (foundset.flag_super_administrator == 1) 
			administratorLevel = 2;
		
	}
	
	forms.ma_sec_main_user_security.setValueList();
	forms.ma_sec_main_user_security.enableDisableForm();
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"8B3CDE53-7C36-4D3F-B012-ADAEFC0BA147"}
 */
function addUser(event) 
{
	forms.ma_sec_main_user_tbl.addRecord(event);
}

/**
 * Lookup per selezione lavoratore singolo
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"CD5782D8-9D08-43FA-94CE-17994130FE88"}
 */
function lookupLavoratore(event) 
{
	vCompanyID = globals.ma_utl_showLkpWindow({ event: event, lookup: 'AG_Lkp_Ditta' });
	globals.ma_utl_showLkpWindow({ event: event,
		                           lookup: 'AG_Lkp_Lavoratori', 
								   methodToAddFoundsetFilter: 'filterLavoratori', 
								   methodToExecuteAfterSelection: 'updateLavoratore'
								 });
}

/**
 * Lookup per selezione multipla lavoratori 
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"B4591ED4-1DF6-4C7A-A7F9-07ED4134E8A4"}
 * @AllowToRunInFind
 */
function lookupLavoratori(event) 
{
	// rendiamo disabilitati i lavoratori precedentemente mappati (modificabili in gestione singola)
	var arrLavMappati = [];
	/** @type {JSFoundset<db:/svy_framework/sec_user_to_lavoratori>} */
	var fsLavMappati = databaseManager.getFoundSet(globals.Server.SVY_FRAMEWORK, 'sec_user_to_lavoratori');
	if(fsLavMappati && fsLavMappati.find())
	{
		fsLavMappati.owner_id = forms.ma_sec_main.owner_id || globals.svy_sec_lgn_owner_id;
		fsLavMappati.idlavoratore = '!^';
		fsLavMappati.search();
	}
	arrLavMappati = globals.foundsetToArray(fsLavMappati,'idlavoratore');
	
	vCompanyID = globals.ma_utl_showLkpWindow({ event: event, lookup: 'AG_Lkp_Ditta' });
	
	globals.ma_utl_showLkpWindow({ event: event, 
		                           lookup: globals.getTipologiaDitta(vCompanyID) == globals.Tipologia.ESTERNA ? 'AG_Lkp_LavoratoriEsterni' : 'AG_Lkp_Lavoratori',
								   methodToAddFoundsetFilter: 'filterLavoratori',
								   methodToExecuteAfterMultipleSelection: 'updateLavoratori',
								   multiSelect : true,
								   disabledElements : arrLavMappati});
	
}

/**
 * @properties={typeid:24,uuid:"744E92B4-8D4E-4A32-AEE2-95BC801FD721"}
 */
function filterLavoratori(fs)
{
	if(fs)
	{
		fs.addFoundSetFilterParam('idditta', globals.ComparisonOperator.EQ, vCompanyID);
//		fs.addFoundSetFilterParam('cessazione',globals.ComparisonOperator.EQ,null);
	}
	return fs;
}

/**
 * @properties={typeid:24,uuid:"3BD7099C-72CE-41FB-BBB9-2A2C9DE93940"}
 */
function updateLavoratore(lavoratore)
{
	if(lavoratore)
	{
		if(!(sec_user_to_sec_user_to_lavoratori.idlavoratore || sec_user_to_sec_user_to_lavoratori.owner_id))
		{
			var recUserLav = sec_user_to_sec_user_to_lavoratori.getRecord(sec_user_to_sec_user_to_lavoratori.newRecord());
			recUserLav.idlavoratore = lavoratore.idlavoratore;
			recUserLav.owner_id = owner_id = forms.ma_sec_main.owner_id || globals.svy_sec_lgn_owner_id;
			name_last = lavoratore.lavoratori_to_persone.cognome;
			name_first_names = lavoratore.lavoratori_to_persone.nome;
			user_name = lavoratore.codicefiscale;
			com_email = globals.getMailLavoratore(lavoratore.idlavoratore);

			// creazione password iniziale
			sec_user_to_sec_user_password.newRecord();
			sec_user_to_sec_user_password.start_date = new Date();
			var userRandomPwd = globals.ma_utl_generatePwd();
			sec_user_to_sec_user_password.password_value = utils.stringMD5HashBase64(userRandomPwd);

		}		
		else
		{
			sec_user_to_sec_user_to_lavoratori.idlavoratore = lavoratore.idlavoratore;
			sec_user_to_sec_user_to_lavoratori.owner_id = forms.ma_sec_main.owner_id || globals.svy_sec_lgn_owner_id;
		}
		
		if(!databaseManager.saveData())
		{
			globals.ma_utl_showErrorDialog('Errore durante la creazione dell\'utente ' + globals.getNominativo(lavoratore.idlavoratore),'Creazione utenze');
		    return;
		}
		
		// aggiorna visibilit� nuovo utente
		globals.ma_sec_setUsersFilters();		
		
		sec_user_to_sec_user.loadAllRecords()
		
		// richiesta invio mail con credenziali all'utente
		var inviaMail = globals.ma_utl_showYesNoQuestion('Comunicare agli utenti le credenziali via mail?','Procedura creazione utenze');
		
		// gestione invio credenziali all'utente
		if(inviaMail)
		{
			if (com_email && plugins.mail.isValidEmailAddress(com_email)) {
				// costruzione intestazione e testo mail
				var subject = "Presenza Semplice Studio Miazzo - Comunicazione avvenuta creazione utente";
				var msgText = "plain msg<html>";
				msgText += "<head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"></head>";
				msgText += "<body>Gentile utente, <br/> con la presente le comunichiamo l\'avvenuto inserimento del proprio utente ";
				msgText += "con le seguenti credenziali : <br/><br/>";
				msgText += "Nome utente : " + user_name + "<br/>";
				msgText += "Password : " + userRandomPwd + "<br/>";
				msgText += "Proprietario : " + sec_user_to_sec_owner.name + "<br/>";
				msgText += "<br/><br/>Collegarsi all\'<a href='https://webapp.studiomiazzo.it/login.html'>applicazione</a> per l'accesso all'applicazione.<br/>"
				msgText += "Si raccomanda di modificare la propria password dopo aver effettuato il primo accesso.</body></html>";

				if (!plugins.mail.sendMail
				(com_email,
				'Creazione utenze <assistenza@studiomiazzo.it>',
				subject,
				msgText,
				null,
				null,
				null,
				globals.setSparkPostSmtpProperties()))
				globals.ma_utl_showWarningDialog(plugins.mail.getLastSendMailExceptionMsg(), 'Comunicazione gestione richiesta');
			} else
				globals.ma_utl_showWarningDialog('i18n:ma.msg.notValidEmailAddress', 'Comunicazione gestione richiesta');
		}
				
	}
	
}

/**
 * @param {Array<Number>} lavoratori
 *
 * @properties={typeid:24,uuid:"6E0B72BF-8CC0-4324-8456-81129C24947C"}
 * @AllowToRunInFind
 */
function updateLavoratori(lavoratori) {
	try {
		// verifica selezione
		if (lavoratori.length == 0)
			return;
		
		/** @type {JSFoundset<db:/svy_framework/sec_user>} */
		var fsUser = databaseManager.getFoundSet(globals.Server.SVY_FRAMEWORK,'sec_user');
		
		/** @type {JSFoundset<db:/svy_framework/sec_user_to_lavoratori>} */
		var fsLavMappati = databaseManager.getFoundSet(globals.Server.SVY_FRAMEWORK, 'sec_user_to_lavoratori');
		if(fsLavMappati && fsLavMappati.find())
		{
			fsLavMappati.owner_id = owner_id || forms.ma_sec_main.owner_id || globals.svy_sec_lgn_owner_id;
			fsLavMappati.search();
		}
		var arrLavMappati = globals.foundsetToArray(fsLavMappati,'idlavoratore');
		
		// richiesta invio mail con credenziali agli utenti
		var inviaMail = false// globals.ma_utl_showYesNoQuestion('Comunicare agli utenti le credenziali via mail?','Procedura creazione utenze');
		
		// per ogni lavoratore selezionato
		for (var l = 0; l < lavoratori.length; l++)
		{
			// controllo per evitare di rimappare dipendenti già mappati (per sicurezza, la modifica di utenti già esistenti va fatta singolarmente)
			if (arrLavMappati.indexOf(lavoratori[l]) == -1) 
			{
				// ottieni informazioni lavoratore e crea i record necessari
				/** @type {JSFoundset<db:/ma_anagrafiche/lavoratori>} */
				var fsLav = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE, globals.Table.LAVORATORI);
				if (fsLav.find()) 
				{
					fsLav.idlavoratore = lavoratori[l];
					if (fsLav.search())
					{
						databaseManager.startTransaction();

						// crea un nuovo record nella tabella sec_user
						var newRecIndex = fsUser.newRecord(false);
						var recUser = fsUser.getRecord(newRecIndex);
						if (!recUser)
							throw new Error('Errore durante la creazione del record utente');

						// inserisci i dati come per il singolo
						recUser.owner_id = forms.ma_sec_main.owner_id || globals.svy_sec_lgn_owner_id;
						recUser.user_name = fsLav.codicefiscale || fsLav.lavoratori_to_lavoratori_personeesterne.codicefiscale;
						recUser.name_first_names = globals.getNome(fsLav.idlavoratore);
						recUser.name_last = globals.getCognome(fsLav.idlavoratore);
						recUser.com_email = globals.getMailLavoratore(fsLav.idlavoratore);
                        
						// creazione password iniziale
						recUser.sec_user_to_sec_user_password.newRecord();
						recUser.sec_user_to_sec_user_password.start_date = new Date();
						var userRandomPwd = globals.ma_utl_generatePwd();
						recUser.sec_user_to_sec_user_password.password_value = utils.stringMD5HashBase64(userRandomPwd);
						
						// crea un nuovo record in sec_user_to_sec_user_lavoratori per la mappatura con sec_user
						var recSecUser = recUser.sec_user_to_sec_user_to_lavoratori.getRecord(fsUser.sec_user_to_sec_user_to_lavoratori.newRecord());
						if (!recSecUser)
							throw new Error('Errore durante la creazione del record utente-lavoratore');

						recSecUser.idlavoratore = fsLav.idlavoratore;
						recSecUser.owner_id = recUser.owner_id;
						
						if (!databaseManager.commitTransaction())
							throw new Error('Errore durante la creazione dell\'utente ' + globals.getNominativo(fsLav.idlavoratore));
						
						// gestione invio credenziali all'utente
						if(inviaMail)
						{
							if (recUser.com_email && plugins.mail.isValidEmailAddress(recUser.com_email)) {
								// costruzione intestazione e testo mail
								var subject = "Presenza Semplice Studio Miazzo - Comunicazione avvenuta creazione utente";
								var msgText = "plain msg<html>";
								msgText += "<head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"></head>";
								msgText += "<body>Gentile utente, <br/> con la presente le comunichiamo l\'avvenuto inserimento del proprio utente ";
								msgText += "con le seguenti credenziali : <br/><br/>";
								msgText += "Nome utente : " + recUser.user_name + "<br/>";
								msgText += "Password : " + userRandomPwd + "<br/>";
								msgText += "Proprietario : " + recUser.sec_user_to_sec_owner.name + "<br/>";
								msgText += "<br/><br/>Collegarsi all\'<a href='https://webapp.studiomiazzo.it/login.html'>applicazione</a> per l'accesso all'applicazione.<br/>"
								msgText += "Si raccomanda di modificare la propria password dopo aver effettuato il primo accesso.</body></html>";

								if (!plugins.mail.sendMail
								(recUser.com_email,
									'Creazione utenze <assistenza@studiomiazzo.it>',
									subject,
									msgText,
									null,
									null,
									null,
									globals.setSparkPostSmtpProperties()))
									globals.ma_utl_showWarningDialog(plugins.mail.getLastSendMailExceptionMsg(), 'Comunicazione gestione richiesta');
							} else
								globals.ma_utl_showWarningDialog('i18n:ma.msg.notValidEmailAddress', 'Comunicazione gestione richiesta');
						}
					}
					
				} else
					globals.ma_utl_showErrorDialog('Cannot go to find mode', 'Creazione utenze multiple');
				
			} else
				globals.ma_utl_showErrorDialog('Dipendente : ' + globals.getNominativo(lavoratori[l]) + ' già mappato. Modificarlo singolarmente se necessario', 'Creazione utenze multiple');
		}
		
		// aggiorna visibilità utenti / lavoratori
		globals.ma_sec_setUsersFilters();
		
		// posizionati automaticamente sull'ultimo utente creato 
		var frm = forms.ma_sec_main_user_tbl;
		var fs = frm.foundset;
		var fsSize = fs.getSize();
		for(var i = 1; i <= fsSize; i++)
		{
			if(fs.getRecord(i).sec_user_to_sec_user_to_lavoratori.idlavoratore == lavoratori[l - 1])
			{
				fs.setSelectedIndex(i);
			    break;
			}
		}
		
	} catch (ex) {
		application.output(ex.message, LOGGINGLEVEL.ERROR);
		databaseManager.rollbackTransaction();
		globals.ma_utl_showErrorDialog(ex.message);

	} finally{ 
		databaseManager.setAutoSave(false);
	}
}

/**
 * Handle changed data.
 *
 * @param {Number} oldValue old value
 * @param {Number} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"E30162FA-57E5-40F8-BC43-F0F88FA86014"}
 * @AllowToRunInFind
 */
function onDataChangeSoloAttivi(oldValue, newValue, event)
{
	doSearch();
	return true;
}

/**
 * @properties={typeid:24,uuid:"AD545735-B847-4215-B4ED-E181AF28CFC5"}
 * @AllowToRunInFind
 */
function doSearch() 
{
	if (forms.ma_sec_main.searchArgument || vChkAttivi || vChkDaAssociare) 
	{
		foundset.find();
		
		// search particular text
		if(forms.ma_sec_main.searchArgument)
		   foundset.name_compound = '#%' + forms.ma_sec_main.searchArgument + '%';
		// search only active users
		if(vChkAttivi)
		{
		   /** @type {JSFoundset<db:/ma_anagrafiche/lavoratori>}*/
		   var fs = databaseManager.getFoundSet(globals.Server.MA_ANAGRAFICHE,globals.Table.LAVORATORI);
		   fs.find();
		   fs.cessazione = '^||>=' + globals.dateFormat(globals.TODAY,globals.ISO_DATEFORMAT) + '|yyyyMMdd';
		   fs.search();
		   var arrAttivi = globals.foundsetToArray(fs,'idlavoratore'); 
           foundset.sec_user_to_sec_user_to_lavoratori.idlavoratore = arrAttivi;
		}
		// search only non-associated users
		if(vChkDaAssociare)
		{
			var sqlUserOrg = "SELECT user_id \
                       FROM sec_user \
                       WHERE user_id NOT IN \
                       (\
                         SELECT user_id \
                         FROM sec_user_org suo \
                       ) \
                       AND owner_id = ? \
			";
			var dsUserOrg = databaseManager.getDataSetByQuery(globals.Server.SVY_FRAMEWORK,sqlUserOrg,[globals.svy_sec_lgn_owner_id],-1);
			
			foundset.user_id = dsUserOrg.getColumnAsArray(1); 
	        
		}		
		foundset.search();
	    
	} else 
		foundset.loadAllRecords();
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"8E34546A-DD0D-490D-8720-1F84845213B4"}
 */
function onActionPrintUtenti(event)
{
	try
	{
		var fileName = ['Utenti_Ruoli', globals.dateFormat(globals.TODAY,globals.ISO_DATEFORMAT)].join('_') + '.xls';
		var localFile = true;
		/** @type {Array<byte>} */
		var output = [];
		var result = [];
		
		var template = plugins.file.readFile('C:/Report/AUT_UtentiRuoli.xls');
		
		var fsUtenti = forms.ma_sec_main_user_tbl.foundset;
		var fsUtentiSize = fsUtenti.getSize();
		var colNames = ['codice','nominativo','codicefiscale','assunzione','scadenzacontratto','cessazione','codditta','ragionesociale','gruppo'];
		
		var ds = databaseManager.createEmptyDataSet(fsUtentiSize,colNames);
		for(var u = 1; u <= fsUtentiSize; u++)
		{
			var rec = fsUtenti.getRecord(u);
			if(rec.sec_user_to_sec_user_to_lavoratori)
			{
				if(rec.sec_user_to_sec_user_to_lavoratori.sec_user_to_lavoratori_to_lavoratori)
				{
					ds.setValue(u,1,rec.sec_user_to_sec_user_to_lavoratori.sec_user_to_lavoratori_to_lavoratori.codice);
					ds.setValue(u,2,rec.sec_user_to_sec_user_to_lavoratori.sec_user_to_lavoratori_to_lavoratori.lavoratori_to_persone ?
							        rec.sec_user_to_sec_user_to_lavoratori.sec_user_to_lavoratori_to_lavoratori.lavoratori_to_persone.nominativo
						            : 
									(rec.sec_user_to_sec_user_to_lavoratori.sec_user_to_lavoratori_to_lavoratori.lavoratori_to_lavoratori_personeesterne ?
						            	rec.sec_user_to_sec_user_to_lavoratori.sec_user_to_lavoratori_to_lavoratori.lavoratori_to_lavoratori_personeesterne.nominativo
									    : ""
									)
								);
					ds.setValue(u,3,rec.sec_user_to_sec_user_to_lavoratori.sec_user_to_lavoratori_to_lavoratori.codicefiscale);
					ds.setValue(u,4,globals.dateFormat(rec.sec_user_to_sec_user_to_lavoratori.sec_user_to_lavoratori_to_lavoratori.assunzione,globals.EU_DATEFORMAT));
					ds.setValue(u,5,globals.dateFormat(rec.sec_user_to_sec_user_to_lavoratori.sec_user_to_lavoratori_to_lavoratori.scadenzacontratto,globals.EU_DATEFORMAT));  			
					ds.setValue(u,6,globals.dateFormat(rec.sec_user_to_sec_user_to_lavoratori.sec_user_to_lavoratori_to_lavoratori.cessazione,globals.EU_DATEFORMAT));
					ds.setValue(u,7,rec.sec_user_to_sec_user_to_lavoratori.sec_user_to_lavoratori_to_lavoratori.lavoratori_to_ditte.codice);
					ds.setValue(u,8,rec.sec_user_to_sec_user_to_lavoratori.sec_user_to_lavoratori_to_lavoratori.lavoratori_to_ditte.ragionesociale);
				}
				else
				{
					ds.setValue(u,1,null)
					ds.setValue(u,2,'');
					ds.setValue(u,3,'');
					ds.setValue(u,4,'');
					ds.setValue(u,5,'');
					ds.setValue(u,6,'');
					ds.setValue(u,7,'');
					ds.setValue(u,8,'');
				}
				
				
				if(rec.sec_user_to_sec_user_org.sec_user_org_to_sec_user_in_group
						&& rec.sec_user_to_sec_user_org.sec_user_org_to_sec_user_in_group.sec_user_in_group_to_sec_group)
				   ds.setValue(u,9,rec.sec_user_to_sec_user_org.sec_user_org_to_sec_user_in_group.sec_user_in_group_to_sec_group.name);
				else
					ds.setValue(u,9,'');
			
			}
		}
		
		result = globals.xls_export(ds,fileName,localFile,false,true,null,'Utenti ruoli',template,colNames);
		ds.removeRow(-1);
		
		output = (result.length > 0 && result) || output;
		
		if(!output)
			return false;
		
		plugins.file.writeFile(fileName,output);
		
	}
	catch(ex)
	{
		application.output(ex, LOGGINGLEVEL.ERROR);
		globals.ma_utl_showErrorDialog('Errore durante l\'esportazione dei dati','Utenti ruoli');
		return false;
	}
	finally
	{
		return true;
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"97AB39BC-5BA5-47B6-942B-7227B2E0FA2D"}
 */
function sendAllCredentials(event) 
{
	var msg = "Con la presente operazione verranno inviate a tutti gli utenti correntemente in lista le credenziali per l\'accesso all\'applicativo.<br/>";
	msg += "Si desidera proseguire?<br/>";
	msg += "<br/>";
	msg += "Attenzione! Verrà generata una nuova password per ogni utente. Le eventuali credenziali comunicate in precedenza non saranno più valide.";
	
    var answer = globals.ma_utl_showYesNoQuestion(msg,'Invio credenziali accesso a tutti gli utenti');
	
	if(!answer)
		return;
	
	var fs = forms.ma_sec_main_user_tbl.foundset;
	
	for(var i = 1; i <= fs.getSize(); i++)
	{
		var rec = fs.getRecord(i);
		
		// genera password istantanea
		var newPwd = globals.ma_utl_generatePwd();
		// salva la nuova password
		globals.svy_sec_setUserPassword(rec,newPwd,newPwd);
		
		var mailAddress = rec.com_email;
		if(mailAddress && plugins.mail.isValidEmailAddress(mailAddress))
		{
			var properties = globals.setSparkPostSmtpProperties();
			var subject = "Presenza Semplice Studio Miazzo - Comunicazione credenziali per accesso all\'applicativo";
			var userName = rec.name_first_names && rec.name_last ? rec.name_first_names + " " + rec.name_last : rec.user_name
			var msgText = "plain msg<html>";
			msgText += "<head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"></head>";
			msgText += "<body>Gentile <b>" + userName;
			msgText += "</b>, <br/>";
		    msgText += "con la presente le comunichiamo le credenziali per le richieste di <b>Ferie e permessi</b>. <br/>";
		    msgText += "Per accedere, collegarsi al sito cliccando sul seguente <a href='https://webapp.studiomiazzo.it/login.html'>link</a> oppure digitando nel vostro browser l\'indirizzo https://webapp.studiomiazzo.it/login.html<br/>";
		    msgText += "<br/>";
		    msgText += "Inserire le seguenti informazioni nei rispettivi campi : <br/>";
		    msgText += "<br/>";
		    msgText += "Utente : <b>" + rec.user_name + "</b><br/>";
		    msgText += "Password <b>: " + newPwd + "</b><br/>";
		    msgText += "Proprietario <b>: " + rec.sec_user_to_sec_owner.name + "</b><br/>";
		    msgText += "<br/>";
		    msgText += "Le ricordiamo che potrà modificare la sua password una volta autenticato, tramite la funzionalità 'Cambia password'.<br/><br/>";
		    msgText += "Cordiali saluti.</body></html>";
			
			var success = plugins.mail.sendMail
			(mailAddress,
				'Gestore autorizzazioni <assistenza@studiomiazzo.it>',
				subject,
				msgText,
				null,
				null,
				null,
				properties);
			if (!success)
			{
				application.output('Invio comunicazione non riuscito per l\'utente ' + rec.user_name,LOGGINGLEVEL.ERROR);
				globals.ma_utl_showWarningDialog(plugins.mail.getLastSendMailExceptionMsg(), 'Comunicazione nuova password');
			}
			else
				application.sleep(500);
		}
		else
		{
			globals.ma_utl_showWarningDialog('Indirizzo email per l\'utente ' + rec.user_name +' non valido. Contattare il gestore delle utenze od il servizio di assistenza dello Studio.', 'Invio credenziali');
			continue;
		}
	}
}

/**
 * @properties={typeid:24,uuid:"2532BCE5-CF1E-4954-9E4B-C742B2D4EB92"}
 */
function sendCredentials(event)
{
	var msg = "Con la presente operazione verranno inviate all'utente correntemente visualizzato le credenziali per l\'accesso all\'applicativo.<br/>";
	msg += "Si desidera proseguire?<br/>";
	msg += "<br/>";
	msg += "Attenzione! Verrà generata una nuova password per l'utente. Le eventuali credenziali comunicate in precedenza non saranno più valide. Se si desidera solamente modificare la password, utilizzare la funzionalità apposita.";
	
	var answer = globals.ma_utl_showYesNoQuestion(msg,'Invio credenziali accesso');
	
	if(!answer)
		return;
	
	var fs = forms.ma_sec_main_user_tbl.foundset;
	
	var rec = fs.getSelectedRecord();
	
	// genera password istantanea
	var newPwd = globals.ma_utl_generatePwd();
	// salva la nuova password
	globals.svy_sec_setUserPassword(rec,newPwd,newPwd);
	
	var mailAddress = rec.com_email;
	if(mailAddress && plugins.mail.isValidEmailAddress(mailAddress))
	{
		var properties = globals.setSparkPostSmtpProperties();
		var subject = "Presenza Semplice Studio Miazzo - Comunicazione credenziali per accesso all\'applicativo";
		var userName = rec.name_first_names && rec.name_last ? rec.name_first_names + " " + rec.name_last : rec.user_name
		var msgText = "plain msg<html><head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"></head>";
		msgText += "<body>Gentile <b>" + userName;
		msgText += "</b>, <br/>";
	    msgText += "con la presente le comunichiamo le credenziali per le richieste di <b>Ferie e permessi</b>. <br/>";
	    msgText += "Per accedere, collegarsi al sito cliccando sul seguente <a href='https://webapp.studiomiazzo.it/login.html'>link</a> oppure digitando nel vostro browser l\'indirizzo https://webapp.studiomiazzo.it/login.html<br/>";
	    msgText += "<br/>";
	    msgText += "Inserire le seguenti informazioni nei rispettivi campi : <br/>";
	    msgText += "<br/>";
	    msgText += "Utente : <b>" + rec.user_name + "</b><br/>";
	    msgText += "Password <b>: " + newPwd + "</b><br/>";
	    msgText += "Proprietario <b>: " + rec.sec_user_to_sec_owner.name + "</b><br/>";
	    msgText += "<br/>";
	    msgText += "Le ricordiamo che potrà modificare la sua password una volta autenticato, tramite la funzionalità 'Cambia password'.<br/><br/>";
	    msgText += "Cordiali saluti.</body></html>";
		
		var success = plugins.mail.sendMail
		(mailAddress,
			'Gestore autorizzazioni <assistenza@studiomiazzo.it>',
			subject,
			msgText,
			null,
			null,
			null,
			properties);
		if (!success)
		{
			application.output('Invio comunicazione non riuscito per l\'utente ' + rec.user_name,LOGGINGLEVEL.ERROR);
			globals.ma_utl_showWarningDialog(plugins.mail.getLastSendMailExceptionMsg(), 'Comunicazione nuova password');
		}
	}
	else
	{
		globals.ma_utl_showWarningDialog('Indirizzo email per l\'utente ' + rec.user_name +' non valido. Contattare il gestore delle utenze od il servizio di assistenza dello Studio.', 'Invio credenziali');
		return;
	}
	
}