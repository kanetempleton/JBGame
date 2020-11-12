//import axios from 'axios';

function tryregister() {
const URL=''

	const un = document.getElementById("enterUsername").value;
	const em = document.getElementById("enterEmail").value;
	const pw = document.getElementById("enterPassword").value;
	if (un.length == 0 || pw.length==0 || em.length==0) {
    	    document.getElementById("msgText").innerHTML = "Need nonzero length for username, password, and email.";
    	    return;
    }
	var pw2 = rsaEncrypt(5,38407,pw);
	document.getElementById("msgText").innerHTML = "Waiting for reply from server...";

	const sendme={
	    packet:0,
		username:un,
		password:pw2,
		email:em,
		end:0
	}
$.ajax({
        url: URL,
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        data: sendme,
        success: function(result) {
            // Do something with the result
            console.log(result)

            if (result == 'retry') {
                tryregister();
            }
            else if (result == 'registersuccess') {
                document.getElementById("msgText").innerHTML = "Account registered successfully.";
            }
            else if (result == 'registeralreadyexists') {
                document.getElementById("msgText").innerHTML = "This username is already registered. Please <a href='login.html'>login.</a>";
            }
            else if (result == 'failedusercheck') {
                document.getElementById("msgText").innerHTML = "Invalid username format.<br>Username must be between 1 and 14 characters long and must only contain letters and numbers.";
            }
            else if (result == 'failedpwcheck') {
                document.getElementById("msgText").innerHTML = "Invalid password format.<br>Password must be between 6 and 20 characters long and must only contain letters, numbers, and printable symbols.<br>Password cannot include @ sign.";
            }
            else if (result == 'failedemailcheck') {
                document.getElementById("msgText").innerHTML = "Invalid email entered.";
            }
            else if (result == 'dupeemail') {
                document.getElementById("msgText").innerHTML = "An account is already registered with this email address.";
            }
            else {
                document.getElementById("msgText").innerHTML = "Bad response code from server. Could not register account.";
            }
        }
    });
}

function stringToBytesFaster ( str ) {
var ch, st, re = [], j=0;
for (var i = 0; i < str.length; i++ ) {
    ch = str.charCodeAt(i);
    if(ch < 127)
    {
        re[j++] = ch & 0xFF;
    }
    else
    {
        st = [];    // clear stack
        do {
            st.push( ch & 0xFF );  // push byte to stack
            ch = ch >> 8;          // shift value down by 1 byte
        }
        while ( ch );
        // add stack contents to result
        // done because chars have "wrong" endianness
        st = st.reverse();
        for(var k=0;k<st.length; ++k)
            re[j++] = st[k];
    }
}
// return an array of bytes
return re;
}


function rsaEncrypt(e, n, M) {
       var mm = stringToBytesFaster(M);
        var outp = "";
        for (var i=0; i<mm.length; i++) {
            var mi = mm[i];
            var encr = Math.pow(mi,e)%n;
            var ss = encr.toString(16);
            outp = outp+""+ss;
        }
        return outp;
 }

var registerbutton = document.getElementById("createAccButton");
registerbutton.addEventListener ("click", function() {

    //USE POST FOR NEW USER
	/*$.post(URL,sendme,function(data,status) {
		//console.log('sent POST with data=<'+data+'>')
		//document.write(data);
		console.log(data);
		document.write(data);
	});*/

	//USE PUT FOR MODIFICATIONS
	/*$.ajax({
        url: '/usernew',
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        data: sendme,
        success: function(result) {
            // Do something with the result
            console.log(result)
            if (result == 'retry') {

            }
        }
    });*/
    tryregister();
});

function render() {

}


render();
