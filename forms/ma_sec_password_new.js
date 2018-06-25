/**
 * @properties={typeid:35,uuid:"5316DAE6-F13A-4C34-B07D-C3BBAF68DC1B",variableType:-4}
 */
var vChkInChiaro = false;

/**
 * @properties={typeid:35,uuid:"516D8FA2-DF8C-4FC7-99A3-A439C9A387B2",variableType:-4}
 */
var vChkGestore = false;

/**
 * Method to check a password, for lenght, begin, equal, not the same begin, must contain numbers.
 *
 * @author Sanneke Aleman
 * @since 2008-05-04
 * 
 * @edited Giovanni
 * 
 * @param {JSEvent} _event
 *
 * @properties={typeid:24,uuid:"620E0477-DB04-43BB-9E3A-1D4FB12FAF7A"}
 */
function check_password(_event)
{ 
	var params = {
        processFunction: process_check_password,
        message: '', 
        opacity: 0.5,
        paneColor: '#434343',
        textColor: '#EC1C24',
        showCancelButton: false,
        cancelButtonText: '',
        dialogName : '',
        fontType: 'Arial,4,25',
        processArgs: [_event]
    };
	plugins.busy.block(params);
}

/**
 * Valida ed inserisce la nuova password inserita
 * 
 * @param _event
 *
 * @properties={typeid:24,uuid:"B1227A82-164B-4DC2-A6EB-62DAA562DED1"}
 */
function process_check_password(_event)
{
	globals.svy_sec_owner_id = globals.svy_sec_getOwnerId()
	
	if(globals.svy_sec_trigger_form != 'ma_sec_main_user_password_tbl') // form is not called from user_dtl form
	   globals.svy_sec_user_id = _to_sec_user_org.sec_user_org_to_sec_user.user_id
	else
	   globals.svy_sec_user_id = forms.ma_sec_main_user_access.user_id
	
	//check the password
	var _password = globals.svy_sec_setUserPassword(_to_sec_user$svy_sec_user_id.getSelectedRecord(),new_password,retype_newpassword);

	if(_password) //not a good password
	{
		plugins.busy.unblock();
		elements.lbl_warning.text = _password; 
		return;
	}
	
	password_ok = 1;
	globals.svy_sec_trigger_form = null;
	globals.svy_mod_closeForm(_event);
	//_CloseAndContinue(_event)
	plugins.busy.unblock();			
	
	if(vChkGestore)
	{
		var answer = globals.ma_utl_showYesNoQuestion('Inviare all\'utente una comunicazione con la nuova password?');
		if(answer)
		{
			var rec = forms.ma_sec_main_user_access.foundset.getSelectedRecord();
			var mailAddress = rec.com_email;
			if(mailAddress && plugins.mail.isValidEmailAddress(mailAddress))
			{
				var properties = globals.setSparkPostSmtpProperties();
				var subject = "Presenza Semplice Studio Miazzo - Comunicazione nuova password per accesso all\'applicativo";
				var userName = rec.name_first_names && rec.name_last ? rec.name_first_names + " " + rec.name_last : rec.user_name
				var msgText = "plain msg<html>";
				msgText += "<head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"></head>";
				msgText += "<body>Gentile <b>" + userName;
				msgText += "</b>, <br/>";
			    msgText += "con la presente le comunichiamo la nuova password per l\'accesso all'applicativo. <br/>";
			    msgText += "La nuova password è la seguente : <b><i>" + new_password + "</i></b>.<br/><br/>";
			    msgText += "Le ricordiamo che potrà modificare la sua password una volta autenticato, tramite la funzionalità 'Cambia password'.<br/><br/>";
			    msgText += "Cordiali saluti.</html>";
				
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
					application.output('Invio comunicazione non riuscito',LOGGINGLEVEL.ERROR);
					globals.ma_utl_showWarningDialog(plugins.mail.getLastSendMailExceptionMsg(), 'Comunicazione nuova password');
				}
			}
			else
			{
				globals.ma_utl_showWarningDialog('Indirizzo email non valido. Contattare il gestore delle utenze o lo Studio.', 'Recupero password');
				return;
			}
		}
	}
}

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
 * @properties={typeid:24,uuid:"9D728133-3D81-45E7-9F72-214665C70EF9"}
 */
function onDataChangeInChiaro(oldValue, newValue, event) {
	
	elements.fld_in_chiaro.visible = newValue;
	return true
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"9C4DBD43-2D3D-4E63-9E40-C04E371085AB"}
 */
function onShow(firstShow, event) 
{
	plugins.busy.prepare();
}
