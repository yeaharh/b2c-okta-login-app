

function onLoadIndex(){

    var state = sessionStorage.getItem("xState") ?? "";

    if (state == "" ){
        sessionStorage.setItem("xState", "Initial");
    }

    if (state == "Logged out of B2C"){
        sessionStorage.removeItem("xIdTokenHint", "Initial");
    }

    console.log("xState: " + state);

}

//  ****************************************************************************************************************************

function signInB2C(){

    url = 
                "https://awaredevb2cmembers.b2clogin.com/awaredevb2cmembers.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1A_TEST_SIGNIN_USERNAME-TAL" +
                "&client_id=ddd42294-b4c3-434d-9930-2a92b13a2772" +
                "&response_type=id_token" +
                "&response_mode=fragment" +
                "&scope=openid" +
                "&redirect_uri=http%3A%2F%2Flocalhost%3A8080" +
                "&state=B2CLogin" +
                "&nonce=any-valid-nonce" +
                "&prompt=login";

    console.log("Login to B2C: " + url);

    window.location.href = url;

    sessionStorage.setItem("xState","Logged into B2C");

}

//  ****************************************************************************************************************************

function signInOkta(){

    var selection = document.getElementById("b2cIdP").value;

    if (selection == "Test-Web-App") {
        url = 
            "https://globalidentity.okta.com/oauth2/v1/authorize?idp=0oa4ks0i1DoWp3oJ0696" +
            "&client_id=0oa4l0bwpVwJdPd3F696" +
            "&response_type=id_token" +
            "&response_mode=fragment" +
            "&scope=openid%20email%20profile" +
            "&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fredirect.html" +
            "&state=OktaLogin" +
            "&nonce=any-valid-nonce";
    }
    else{
        url = 
            "https://globalidentity.okta.com/oauth2/v1/authorize?idp=0oa4l2145U1myHGqA696" +
            "&client_id=0oa4l0bwpVwJdPd3F696" +
            "&response_type=id_token" +
            "&response_mode=fragment" +
            "&scope=openid%20email%20profile" +
            "&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fredirect.html" +
            "&state=OktaLogin" +
            "&nonce=any-valid-nonce";

    }

    sessionStorage.setItem("xSelection", selection);

    console.log("Login via: " + selection + ": " + url);

    window.location.href = url;

    sessionStorage.setItem("xState","Logged into Okta");

}

//  ****************************************************************************************************************************

function onLoadRedirect(){

    console.log("Setting Messages");
    
    var state = sessionStorage.getItem("xState")
    var statusMsg = "Congratuations you are logged into the Okta Insurance App";
    var configMsg = "via the B2C idP :: " + sessionStorage.getItem("xSelection");

    if (state == "Logged out of Okta") {
        statusMsg = "You have logged out of the Okta Insurance App";
        configMsg = "but you're still logged into B2C";
        document.getElementById("inspectJwt").hidden = true;
        document.getElementById("logoutOkta").disabled = true;
    }
    else{
        document.getElementById("logoutB2C").disabled = true;
    }

    document.getElementById("statusMessage").innerText = statusMsg
    
    document.getElementById("configMessage").innerText = configMsg

    console.log("xState: " + state);
}

//  ****************************************************************************************************************************

function inspectJwt(){

    inspectFragment()
    var url = "https://jwt.ms/#id_token=" + sessionStorage.getItem("xIdTokenHint")
    window.open(url);

}

//  ****************************************************************************************************************************

function inspectFragment(){

const frag = window.location.hash;

console.log("fragment: " + frag);

if (window.location.hash) {

    var state = getUrlFragment('state');
    var idToken = getUrlFragment('id_token');

    sessionStorage.setItem("xState", state);
    sessionStorage.setItem("xIdTokenHint", idToken);

    console.log("state: " + state);
    console.log("idToken: " + idToken);
}
else {

    var error = params.get("error");
    var description = params.get("error_description");

    sessionStorage.setItem("xError", error);
    sessionStorage.setItem("xDescription", description);

    console.log("error: " + error);
    console.log("description: " + description);
}
}

//  ****************************************************************************************************************************

function getUrlFragment(fragmentId) {
    fragmentId = fragmentId + '=';
    if (window.location.hash && window.location.hash.length > 0) {
        var fragmentValueStartIndex = 0;
        var fragmentIdStartIndex = window.location.hash.indexOf(fragmentId);
        if (fragmentIdStartIndex > -1) {
            fragmentValueStartIndex = fragmentIdStartIndex + fragmentId.length;
        }

        if (fragmentValueStartIndex > 0) {
            var fragmentValue = window.location.hash.substring(fragmentValueStartIndex);
            var ampIndex = fragmentValue.indexOf('&');
            if (ampIndex !== -1) {
                fragmentValue = fragmentValue.substring(0, ampIndex);
            }

            return fragmentValue;
        }

        return null;
    }
}

//  ****************************************************************************************************************************

function logoutB2C(){

    var state = sessionStorage.getItem("xState") ?? ""

    console.log("xState: " + state);

    if (state == "Logged into Okta"){
        window.alert("Log out of Okta first");
    }
    else {
        url = 
        "https://awaredevb2cmembers.b2clogin.com/awaredevb2cmembers.onmicrosoft.com/B2C_1A_TEST_SIGNIN_USERNAME-TAL/oauth2/v2.0/Logout?" +
        "&client_id=ddd42294-b4c3-434d-9930-2a92b13a2772" +
        "&post_logout_redirect_uri=http%3A%2F%2Flocalhost%3A8080" +
        "&state=B2Clogout";

        console.log("Logout: " + url);

        window.location.href = url;

        sessionStorage.setItem("xState", "Logged out of B2C");
    }
}

//  ****************************************************************************************************************************

function logoutOkta(){

    var idToken = sessionStorage.getItem("xIdTokenHint") ?? ""

    if (idToken.length == 0){
        inspectFragment()
    }

    url = 
                "https://globalidentity.okta.com/oauth2/v1/logout?" +
                "client_id=0oa4l0bwpVwJdPd3F696" +
                "&id_token_hint=" + sessionStorage.getItem("xIdTokenHint") +
                "&post_logout_redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fredirect.html" +
                "&state=Oktalogout";

                console.log("Logout: " + url);

    window.location.href = url;

    sessionStorage.setItem("xState", "Logged out of Okta");

}

