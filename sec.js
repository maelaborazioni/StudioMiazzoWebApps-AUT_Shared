/**
 * Retrieve the modules for the provided organization id. If not given, uses the login organization
 * @param [organizationid]
 * 
 * @return {JSFoundset}
 *
 * @properties={typeid:24,uuid:"7653C2C3-39A0-462C-AC36-4F19EE4C0B32"}
 */
function GetModules(organizationid)
{
	var fs;
	if(!organizationid)
		fs = _to_sec_organization$lgn;
	else
	{
		fs = datasources.db.svy_framework.sec_organization.getFoundSet();
		fs.loadRecords(organizationid);
	}
		
	return fs.sec_organization_to_sec_owner
		     .sec_owner_to_sec_owner_in_module;
}