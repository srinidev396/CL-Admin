var lpid = document.getElementById("Lpid");
var btn_logout = document.getElementById("btn_logout");
var loginPage = document.getElementById("loginPage");
var alertpar = document.getElementById("alertWindowpa");
var alertheader = document.getElementById("alertWindowheader")

//login to client
function GetToken() {
    lpid.classList.add("invisible");
    var prop = document.getElementById("frmlogin");
    var url = `${app.LicenseServiceUrl}GenerateToken?`;
    var userName = prop[0].value;
    var password = prop[1].value;
    var database = prop[2].value;
    var sendurl = `${url}userName=${userName}&passWord=${password}&database=${database}`
    FETCHGET(sendurl, "html").then((data) => {
        // document.getElementById("Lpid").innerHTML = data;
        if (data.includes("4060"))  // 4060 is bad request
        {
            lpid.classList.remove("invisible");
            lpid.innerHTML = "Id or Password is not correct.";
            lpid.style.color = 'red';
            return;
        }
        sessionStorage.setItem("token", data);
        GoToMainMenu();

    }).catch((err => {
        btn_logout.classList.add("invisible");
        if (err.message.includes("Failed")) {
            lpid.classList.remove("invisible");
            lpid.innerHTML = "License Server is not running. Please check it !";
        }
        else {
            lpid.classList.remove("invisible");
            lpid.innerHTML = err;
            lpid.style.color = 'red';
        }
    }))
}
//main menu select license.
function GoToMainMenu() {
    var rmslicensenew = document.getElementById("rmslicensenew");
    var rmslicenseexist = document.getElementById("rmslicenseexist");
    var licenseselection = document.getElementById("licenceSelection");
    loginPage.style.display = "none";
    if (rmslicensenew != null) {
        rmslicensenew.remove();
    }
    if (rmslicenseexist != null) {
        rmslicenseexist.remove();
    }

    licenseselection.style.display = "block";
    btn_logout.classList.remove("invisible");
}
//submit license entry point for exist and new
function SubmitLicense(isnew) {
    if (isnew) {
        SubmitnewCustomer()
    } else {
        SubmitExistingCustomer();
    }
}
//submit new customer
function SubmitnewCustomer() {
    var model = NewCustomermodel();
    var elementids = ["CompanyName", "Address", "City", "StateProvice", "Country", "ZipCode", "Title", "Phone", "Email", "FullName", "LicenseType", "LicenseCount", "ExpiryDate", "ServerName", "databasename", "sqlusername", "sqlpassword", "DatabaseKey"];
    if (!FieldsValidation(elementids)) return;
    var url = `${app.LicenseServiceUrl}FusionRMSLicense/GenerateFusionRMSLicense`;
    FETCHPOSTAUTH(url, model).then((data) => {
        if (data.isError) {
            errorMessages(data)
        } else {
            var msg = `You've created a new <span style="color:blue">${model.LCLicenseType.TypeName}</span> license for <span style="color:blue">${model.LCCustomers.CompanyName}</span> with <span style="color:blue">${model.LCFusionRMSLicense.LicenseCount}</span> seats, set to expire on <span style="color:blue">${model.LCFusionRMSLicense.ExpiryDate}</span>.`
            showAlertWindow("Success!", Headercolor.success, msg, "");
            GoToMainMenu();
        }

    });

}
//submit existing customer
function SubmitExistingCustomer() {
    var model = ExistingCustomermodel();
    var elementids = ["companyExistdropdown", "LicenseType", "LicenseCount", "ExpiryDate","DatabaseKey", "ServerName","sqlusername", "sqlpassword","databasename"];
    if (!FieldsValidation(elementids)) return;
    var url = `${app.LicenseServiceUrl}FusionRMSLicense/GenerateFusionRMSLicense`;
    FETCHPOSTAUTH(url, model).then((data) => {
        if (data.isError) {
            errorMessages(data)
        } else {
            var msg = `You've added a new <span style="color:blue">${model.LCLicenseType.TypeName}</span> license for <span style="color:blue">${model.LCCustomers.CompanyName}</span> with <span style="color:blue">${model.LCFusionRMSLicense.LicenseCount}</span> seats, set to expire on <span style="color:blue">${model.LCFusionRMSLicense.ExpiryDate}</span>.`
            showAlertWindow("Success!", Headercolor.success, msg, "");
            GoToMainMenu();
        }

    });
}
//validate fields
function FieldsValidation(elementids) {
    for (let i = 0; i < elementids.length; i++) {
        var elem = document.getElementById(elementids[i]);
        elem.style.borderColor = "";
        if (elem.value == "" || elem.value == "-1") {
            elem.style.borderColor = "red";
            elem.focus();
            return false;
        }
    }
    return true;
}
//create licese for new customer
function FusionRMSFormNew() {
    var licenseselection = document.getElementById("licenceSelection");
    licenseselection.style.display = "none";
    NewlicenseFormHtml();
    GetDropDowns();
}
//create license for exist customer
function FusionRMSFormExist() {
    var licenseselection = document.getElementById("licenceSelection");
    licenseselection.style.display = "none";
    ExistLicenseFormHtml();
    GetDropDowns()

}
//write new html license form
function NewlicenseFormHtml() {
    var body = document.getElementsByClassName("container mx-auto")[0]
    body.innerHTML += `
        <div id="rmslicensenew" style="text-align: left;" class="custom-container">
            <form autocomplete="off">
                <!--company information-->
                <div class="section-header">Company Information</div>
                <div class="form-group">
                    <label for="CompanyName">Company Name</label>
                    <input onblur="IsCustomerExist()" type="text" id="CompanyName" name="CompanyName">
                </div>
                <div class="form-group">
                    <label for="Address">Address</label>
                    <input type="text" id="Address" name="Address">
                </div>
                <div class="form-group">
                    <label for="City">City</label>
                    <input type="text" id="City" name="City">
                </div>
                <div class="form-group">
                    <label for="StateProvice">State/Province</label>
                    <input type="text" id="StateProvice" name="StateProvice">
                </div>
                <div class="form-group">
                    <label for="Country">Country</label>
                    <input type="text" id="Country" name="Country">
                </div>
                <div class="form-group">
                    <label for="ZipCode">Zip Code</label>
                    <input type="text" id="ZipCode" name="ZipCode">
                </div>
                <div class="form-group">
                    <label for="Comment">Comment</label>
                    <input type="text" id="Comment" name="Comment">
                </div>
                <!--contact information-->
                <div class="section-header">Contact</div>
                <div class="form-group">
                    <label for="Title">Title</label>
                    <input type="text" id="Title" name="Title">
                </div>
                <div class="form-group">
                    <label for="Phone">Phone</label>
                    <input type="text" id="Phone" name="Phone">
                </div>
                <div class="form-group">
                    <label for="Email">Email</label>
                    <input type="email" id="Email" name="Email">
                </div>
                <div class="form-group">
                    <label for="FullName">Full Name</label>
                    <input type="text" id="FullName" name="FullName">
                </div>
                <!--license details-->
                <div class="section-header">License Details</div>
                <div id="companyExistdiv" style="display: none;" class="form-group">
                    <label for="LicenceType">Company Name</label>
                    <select id="companyExistdropdown">

                    </select>
                </div>
                <div class="form-group">
                    <label for="LicenceType">License Type</label>
                    <select id="LicenseType">

                    </select>
                </div>
                <div class="form-group">
                    <label for="LicenseCount">License Count</label>
                    <input type="number" id="LicenseCount" name="LicenseCount">
                </div>
                <div class="form-group">
                    <label for="ExpiryDate">Expiry Date</label>
                    <input type="date" id="ExpiryDate" name="ExpiryDate">
                </div>
                <div class="form-group">
                    <label for="DatabaseKey">Database Key</label>
                    <input type="text" id="DatabaseKey" name="DatabaseKey">
                </div>

                <div class="form-group">
                    <label for="ServerName">Server Name</label>
                    <input type="text" id="ServerName" name="ServerName">
                </div>
                <div class="form-group">
                    <label for="sqlusername">Sql UserName</label>
                    <input type="text" id="sqlusername" name="sqlusername">
                </div>
                <div class="form-group">
                    <label for="sqlpassword">Sql Password</label>
                    <input type="text" id="sqlpassword" name="sqlpassword">
                </div>
                <div class="form-group">
                    <label for="databasename">Database Name</label>
                    <input type="text" id="databasename" name="databasename">
                </div>
                <div class="form-group">
                    <button type="button" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onclick="SubmitLicense(true)">SUBMIT</button>
                </div>
        </form>
    </div>`
}
//write existing html license form
function ExistLicenseFormHtml() {
    var body = document.getElementsByClassName("container mx-auto")[0];
    body.innerHTML += `<div id="rmslicenseexist" style="text-align: left;" class="custom-container">
    <div class="section-header">License Details</div>
    <div class="form-group">
        <label for="LicenceType">Company Name</label>
        <select id="companyExistdropdown">

        </select>
    </div>
    <div class="form-group">
        <label for="LicenceType">License Type</label>
        <select id="LicenseType">

        </select>
    </div>
    <div class="form-group">
        <label for="LicenseCount">License Count</label>
        <input type="number" id="LicenseCount" name="LicenseCount">
    </div>
    <div class="form-group">
        <label for="ExpiryDate">Expiry Date</label>
        <input type="date" id="ExpiryDate" name="ExpiryDate">
    </div>
    <div class="form-group">
        <label for="DatabaseKey">Database Key</label>
        <input type="text" id="DatabaseKey" name="DatabaseKey">
    </div>

    <div class="form-group">
        <label for="ServerName">Server Name</label>
        <input type="text" id="ServerName" name="ServerName">
    </div>
    <div class="form-group">
        <label for="sqlusername">Sql UserName</label>
        <input type="text" id="sqlusername" name="sqlusername">
    </div>
    <div class="form-group">
        <label for="sqlpassword">Sql Password</label>
        <input type="text" id="sqlpassword" name="sqlpassword">
    </div>
    <div class="form-group">
        <label for="databasename">Database Name</label>
        <input type="text" id="databasename" name="databasename">
    </div>
    <div class="form-group">
        <button type="button" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onclick="SubmitLicense(false)">SUBMIT</button>
    </div>
</div>`
}
//get license type 
function GetDropDowns() {
    var licenseType = document.getElementById("LicenseType");
    var companyExistdropdown = document.getElementById("companyExistdropdown");
    var url = `${app.LicenseServiceUrl}FusionRMSLicense/GetDropdowns`;
    FETCHGETAUTH(url).then((data) => {
        if (data.isError) {
            alert(data.message);
            location.reload();
        } else {
            licenseType.innerHTML = "";
            licenseType.innerHTML += "<option value='-1'>--SELECT--</option>";
            data.licenseType.forEach((v, i) => {
                licenseType.innerHTML += `<option value="${v.id}">${v.typeName}</option>`;
            })
            if (companyExistdropdown != null) {
                companyExistdropdown.innerHTML = "";
                companyExistdropdown.innerHTML += "<option value='-1'>--SELECT--</option>";
                data.customers.forEach((v, i) => {
                    companyExistdropdown.innerHTML += `<option value="${v.id}">${v.companyName}</option>`;
                })
            }
        }
    });
}
//logout from license client
function logout_licenseKeydiv() {
    sessionStorage.removeItem("token");
    location.reload();
}
//model binder to server
function NewCustomermodel() {
    var lcty = document.getElementById("LicenseType");
    return {
        LCCustomers: {
            Id: 0,
            CompanyName: document.getElementById('CompanyName').value,
            Address: document.getElementById('Address').value,
            City: document.getElementById('City').value,
            StateProvince: document.getElementById('StateProvice').value,
            Country: document.getElementById('Country').value,
            Comment: document.getElementById('Comment').value,
            ZipCode: document.getElementById('ZipCode').value
        },
        LCContact: {
            Id: 0,
            Title: document.getElementById('Title').value,
            Phone: document.getElementById('Phone').value,
            Email: document.getElementById('Email').value,
            CustomerId: 0,
            FullName: document.getElementById('FullName').value
        },
        LCLicenseType: {
            Id: 0,
            TypeName: lcty.options[lcty.selectedIndex].text,
            TabProductListId: 0,
        },
        LCTabProductList: {
            Id: 0,
            ProductName: "",
        },
        LCFusionRMSLicense: {
            Id: 0,
            LicenseCount: document.getElementById('LicenseCount').value,
            ActiveCount: 0,
            ExpiryDate: document.getElementById('ExpiryDate').value,
            SqlServerName: document.getElementById('ServerName').value,
            DataBaseName: document.getElementById('databasename').value,
            SqlUser: document.getElementById("sqlusername").value,
            SqlPassword: document.getElementById("sqlpassword").value,
            DatabaseKey: document.getElementById('DatabaseKey').value,
        },
        IsNewCustomer: true
    };
}
function ExistingCustomermodel() {
    var lcty = document.getElementById("LicenseType");
    var licenseType =  lcty.options[lcty.selectedIndex].text;
    var rmslicenseexist = document.getElementById("companyExistdropdown");
    var customername = rmslicenseexist.options[rmslicenseexist.selectedIndex].text;
    return {
        LCCustomers: {
            Id: 0,
            CompanyName: customername,
        },
        LCLicenseType: {
            Id: 0,
            TypeName: licenseType,
            TabProductListId: 0,
        },
        LCFusionRMSLicense: {
            Id: 0,
            LicenseCount: document.getElementById('LicenseCount').value,
            ActiveCount: 0,
            ExpiryDate: document.getElementById('ExpiryDate').value,
            SqlServerName: document.getElementById('ServerName').value,
            DataBaseName: document.getElementById('databasename').value,
            SqlUser: document.getElementById("sqlusername").value,
            SqlPassword: document.getElementById("sqlpassword").value,
            DatabaseKey: document.getElementById('DatabaseKey').value,
        },
        IsNewCustomer: false
    }
}
// check if customer exist
function IsCustomerExist() {
    var companyname = document.getElementById('CompanyName')
    var url = `${app.LicenseServiceUrl}FusionRMSLicense/IsCustomerExist?companyname=${companyname.value}`;
    FETCHGETAUTH(url).then((data) => {
        if (data) {
            companyname.style.borderColor = "red";
            var paragraph = `The customer <span style="color:blue">${companyname.value}</span> is already exist. If you want to add another license, go back to the main menu and click on exist!`;
            showAlertWindow("Warning!", "#ffeb3b", paragraph, "");
        } else {
            companyname.style.borderColor = "";
        }
    });
}

//custom tailwind alert window
function showAlertWindow(Header, HeaderColor, paragraph, paragraphColor) {
    alertheader.innerHTML = Header;
    alertheader.style.color = HeaderColor;
    alertpar.innerHTML = paragraph;
    alertpar.style.color = paragraphColor;
    document.getElementById('alertBackdrop').classList.remove('hidden');
    document.getElementById('alertWindow').classList.remove('hidden');
}
//close alert window
function closeAlertWindow() {
    document.getElementById('alertBackdrop').classList.add('hidden');
    document.getElementById('alertWindow').classList.add('hidden');
}
//error messages
function errorMessages(data) {
    switch (data.errorType) {
        case -1: //general
            showAlertWindow("Information!", Headercolor.info, data.message, "")
            break;
        case 0: //exception
            showAlertWindow("Error!", Headercolor.error, data.message, "")
            break
        case 100: // product not exist
            showAlertWindow("Warning!", Headercolor.warning, data.message, "")
            break
        case 200: //customer not exist
            showAlertWindow("Warning!", Headercolor.warning, data.message, "")
            break;
        case 300: // database key exist
            showAlertWindow("Warning!", Headercolor.warning, data.message, "")
            break;
        case 400: //signin failed
            showAlertWindow("Warning!", Headercolor.warning, data.message, "")
            break;
        case 500: //active user less then license count
             showAlertWindow("Warning!", Headercolor.warning, data.message, "");
            break;
        default:
            break;
    }
}
//colore structure for messages
const Headercolor = {
    warning: "#ffeb3b",
    info: "blue",
    error: "red",
    success: "green"
}


//temp functions
function FillupDataNewForm(counter) {
    document.getElementById("CompanyName").value = `company${counter}`
    document.getElementById("Address").value = `address${counter}`
    document.getElementById("City").value = `city${counter}`
    document.getElementById("StateProvice").value = `StateProvice${counter}`
    document.getElementById("Country").value = `Country${counter}`
    document.getElementById("ZipCode").value = `ZipCode${counter}`
    document.getElementById("Title").value = `Title${counter}`
    document.getElementById("Phone").value = `Phone${counter}`
    document.getElementById("Email").value = `Email${counter}`
    document.getElementById("FullName").value = `FullName${counter}`
    document.getElementById("ServerName").value = `localhost`
    document.getElementById("databasename").value = `JeraldData`
    document.getElementById("sqlusername").value = `sa`
    document.getElementById("sqlpassword").value = `masterB4`
    document.getElementById("DatabaseKey").value = `DatabaseKey${counter}`

}

function FillupDataExistForm(counter) {
    document.getElementById("ServerName").value = `localhost`
    document.getElementById("databasename").value = `JeraldData`
    document.getElementById("sqlusername").value = `sa`
    document.getElementById("sqlpassword").value = `masterB4`
    document.getElementById("DatabaseKey").value = `DatabaseKey${counter}`

}


