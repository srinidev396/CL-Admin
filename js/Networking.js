var app = {
    LicenseServiceUrl:"http://localhost:5001/"
}
var apierror = "";
async function FETCHGET(url, requestData) {
    var rdata = ""
    const call = await fetch(`${url}`)
    if (requestData === "html")
        rdata = await call.text();
    else if (requestData === "json")
        rdata = await call.json();
    const data = await rdata;
    return data;
}

async function FETCHGETAUTH(url) {
    var rdata = ""
    var token = `Bearer ${sessionStorage.getItem("token")}`
    const call = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': token,
        }
    }).then(respose => respose.json())
    var xx = call;
    return call;
}


async function FETCHPOSTAUTH(url = '', data = {}) {
    var token = `Bearer ${sessionStorage.getItem("token")}`
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
        },
        body: JSON.stringify(data)
    })
    if(response.ok == false){
        return response;
    }else {
        return response.json();
    }
}

async function FETCHPOSTRETURNSTRING(url = '', data = {}) {
    var token = `Bearer ${sessionStorage.getItem("token")}`
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
        },
        body: JSON.stringify(data)
    })
    
    if(response.ok == false){
        return response;
    }else{
        return response.text();
    }
}


function errorMessages(elem, errornumber){
  switch (errornumber) {
    case 401:
        elem.innerHTML = `Not Authorized 401`;
        elem.style.color = "red"; 
        break;
    case 400:
        elem.innerHTML = `Bad request, some fiedls are empty`;
        elem.style.color = "red"; 
    default:
        break;
  }
}



async function FETCHPOSTNOAUTH(url = '', data = {}) {
    var token = `Bearer ${sessionStorage.getItem("token")}`
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            //'Authorization': token,
        },
        body: JSON.stringify(data)
    })
    if(response.ok == false){
        return response;
    }else {
        return response.json();
    }
}


//spinningwheel
function showSpinner() {
    document.getElementById("spinner").style.display = "block";
}

function hideSpinner() {
    document.getElementById("spinner").style.display = "none";
}

