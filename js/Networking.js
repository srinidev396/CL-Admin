var app = {
    LicenseServiceUrl: "http://localhost:5001/"
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
    var token = `Bearer ${sessionStorage.getItem("token")}`
    var response = "";
    response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': token,
        }
    });
    if (response.ok == false) {
        if (response.status == 401) {
            alert(`${response.statusText}: The token is expired, please login again!`);
            location.reload();
        }
    } else {
        return response.json();
    }
}


async function FETCHPOSTAUTH(url = '', data = {}) {
    var token = `Bearer ${sessionStorage.getItem("token")}`
    var response = "";
    response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
        },
        body: JSON.stringify(data)
    });

    if (response.ok == false) {
        if (response.status == 401) {
            alert(`${response.statusText}: The token is expired, please login again!`);
            location.reload();
        }
    } else {
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

    if (response.ok == false) {
        return response;
    } else {
        return response.text();
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
    if (response.ok == false) {
        return response;
    } else {
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



