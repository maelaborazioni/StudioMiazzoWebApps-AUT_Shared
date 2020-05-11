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
/**
 * @param [userId]
 * @param [organizationId]
 * 
 * @properties={typeid:24,uuid:"3B11E841-87DF-4E06-A840-B628BB4AF9A2"}
 */
function GetNewAccessToken(userId, organizationId) {
	// TODO Auto-generated method stub
	var url = "https://api.peoplegest.it/Authentication/token";
	var params = {
		userName : "isabella.vavassori",
		password : "pluto",
		GrantType : "password",
		networkCode : "0000000000",
		clientId : "presenzasemplice.studiomiazzo.it"
	};

	
//	var jsonParams = plugins.serialize.toJSON(params).replace(/_([a-zA-Z0-9]+)(\\?":)/g, '$1$2');
	var client = globals.getHttpClient();
	var request = client.createPostRequest(url);
	request.addHeader('Content-type','application/x-www-form-urlencoded');
	request.setBodyContent('userName='.concat(params.userName,'&password=',params.password,'&grantType=',params.GrantType,'&networkCode=',params.networkCode,'&clientId=',params.clientId));
	var response = request.executeRequest();
	if(response)
	{
		var msg = '';
		// We always expect a Json result
		var responseBody = response.getResponseBody();
		var responseObj  = plugins.serialize.fromJSON(responseBody);
		var statusCode   = response.getStatusCode();
		
		switch (statusCode)
		{
			case globals.HTTPStatusCode.OK:
				break;
			default:
				msg = "Errore sconosciuto, codice di risposta: " + statusCode;
		}
		
		return responseObj;
	}
	else
		return { returnValue: false, message: 'Il server non risponde, riprovare' };
}
