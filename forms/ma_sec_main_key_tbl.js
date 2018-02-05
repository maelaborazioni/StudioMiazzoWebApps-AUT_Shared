/**
 * @properties={typeid:24,uuid:"4EC23419-41ED-4AB6-AA24-F05395C8A091"}
 */
function addRecord(event)
{
	foundset.newRecord();
	owner_id = forms.ma_sec_main.owner_id;
	is_client = 1;
	is_client_selectable = 1;
}

/**
 * @properties={typeid:24,uuid:"F8BDB3F9-C706-4FAD-8DA4-B8A774BE18F5"}
 */
function deleteRecord(event)
{
	_super.deleteRecord(event);
	forms.ma_sec_main_key.elements.tab_security_details.enabled = foundset && foundset.getSize() > 0;
}
