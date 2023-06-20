class Licensefuncs {
constructor(){
   this.formlogin_div = document.getElementById("frmlogin_div");
   this.liclogin_div = document.getElementById("liclogin_div");
   this.Liclogin = document.getElementById("Liclogin");
   this.lpid =  document.getElementById("Lpid");
   this.licensetypeid = document.getElementById("licensetypeid");
   this.Spidmsg =  document.getElementById("Spidmsg");
   this.existing_prodid =  document.getElementById("existing_prodid");
   this.existing_licensetypeid =  document.getElementById("existing_licensetypeid");
   this.prodid = document.getElementById("prodid");
   this.key_div = document.getElementById("key_div");
   this.lspid = document.getElementById("Lspid");
   this.close_btn = document.getElementById("close-btn");
   this.my_div = document.getElementById("my_div");
   this.btn_logout = document.getElementById("btn_logout");
   this.search_client = document.getElementById("search_client");
   this.search_client_input = document.getElementById("search_client_input");
   this.client_search_button = document.getElementById("client_search_button");
   this.existing_client = document.getElementById("existing_client");
   this.search_client_p = document.getElementById("search_client_p");
   this.customer_name = document.getElementById("customer_name");
   this.existing_customer_div =  document.getElementById("existing_customer_div");
   this.exLspid = document.getElementById("exLspid");
   this.exkey_div= document.getElementById("exkey_div");
   this.exSpidmsg = document.getElementById("exSpidmsg");
   this.existing_licenseCount = document.getElementById("existing_licenseCount");
   this.existing_expiryDate_id = document.getElementById("existing_expiryDate_id");
   this.existing_newdatabaseid = document.getElementById("existing_newdatabaseid");
   this.existing_comments_id = document.getElementById("existing_comments_id");
   this.existing_licenseCountid = document.getElementById("existing_licenseCountid");
   this.newlicense_id = document.getElementById('newlicense_id');
}

GetToken() {
    License.lpid.classList.add("invisible");
    License.search_client_input.value = "";
    License.btn_logout.classList.remove("invisible");
    var prop = document.getElementById("frmlogin");
    var url = `${app.LicenseServiceUrl}GenerateToken?`;
    var userName = prop[0].value;
    var password = prop[1].value;
    var database = prop[2].value;
    var sendurl = `${url}userName=${userName}&passWord=${password}&database=${database}`
    FETCHGET(sendurl, "html").then((data) => {
        // document.getElementById("Lpid").innerHTML = data;
      if(data.includes("4060"))  // 4060 is bad request
      {
        License.lpid.classList.remove("invisible");
        License.lpid.innerHTML = "Id or Password is not correct.";
        License.lpid.style.color = 'red';
        return;
      }
        License.search_client.style.display ="block";
        License.formlogin_div.style.display = "none";
        // License.search_client.style.display = "block";
        // License.search_client.classList.remove("invisible");
        sessionStorage.setItem("token", data);
        FETCHGETAUTH(`${app.LicenseServiceUrl}LicenseGenerator/GetListOfProducts`).then((d) => {
           
            License.existing_prodid.innerHTML = ""
            License.existing_prodid.innerHTML = `<option value="0">Select Product</option>`
            License.prodid.innerHTML = ""
            License.prodid.innerHTML = `<option value="0">Select Product</option>`
            d.forEach(e => {
                License.existing_prodid.innerHTML += `<option value="${e.id}">${e.name}</option>`
                License.prodid.innerHTML += `<option value="${e.id}">${e.name}</option>`
            });
        })
    }).catch((err => {
        License.lpid.classList.remove("invisible");
        License.lpid.innerHTML = err;
        License.lpid.style.color = 'red';
    }))
}
// License should  not be gnerated again from same Company.
// If token expired,  throw message for users
// if it is 401, kick them out
// CLear everything
// destroy token when we logout
// Duplicate,  Same name does not exit.  ( IsCustomerExit, Duplicate)
//  Color change of each row
// after search, if found , After finishe typing , When search, if customer exist so you open exiting , if customer does not exit 
//  Check again customer name, for Generate new License, 
// Cancel go back to search bar. 
// FOr exiting, remove search bar
//Cancel

GenerateNewLicense() {
    // License.Spidmsg.style.display= 'none';
    License.Spidmsg.classList.add("invisible");
    var prop = License.Liclogin;
    var model = {};
    var customer_name = prop[0].value;
    // if companyName exist or not
FETCHGETAUTH(`${app.LicenseServiceUrl}LicenseGenerator/IsCustomerExist?Customername=${customer_name}`).then((d) => {
      if(d.isCustomerFound){ 
        License.Spidmsg.classList.remove("invisible");
        License.Spidmsg.innerHTML = d.message;
        License.Spidmsg.style.color = 'red';
        return
  }
  else if(d.isError)
  {
    License.Spidmsg.classList.remove("invisible");
    License.Spidmsg.innerHTML = d.message;
    License.Spidmsg.style.color = 'red';
    return
  }
  else{
    model.companyName  = prop[0].value;
    model.address = prop[1].value;
    model.city = prop[2].value;
    model.stateProvice = prop[3].value;
    model.country = prop[4].value;
    model.zipCode = prop[5].value;
    model.contactTitle = prop[6].value;
    model.contactPhone = prop[7].value;
    model.contactFullName = prop[8].value;
    model.contactEmail = prop[9].value;
    model.ProductId = prop[10].value;
    model.LicenseTypeEnumid = prop[11].value;
    model.licenseCount = prop[12].value;
    model.expiryDate = prop[13].value;
    model.database = prop[14].value;
    model.comment = prop[15].value;
   
    var url = `${app.LicenseServiceUrl}LicenseGenerator/GenerateLicense`
    FETCHPOSTRETURNSTRING(url, model).then((key) => {
        if (key.ok == false) {
            License.Spidmsg.classList.remove("invisible");
            errorMessages(License.Spidmsg, key.status);
            if(key.status == 401)
            {
              License.Logout_LicenseKeydiv();
              License.lpid.classList.remove("invisible");
              License.lpid.style.color = 'red';
              errorMessages(License.lpid, key.status);
            
            //   License.lpid.innerHTML = "Id or Password is not correct.";
            
            }
           
            return;
        }
        License.key_div.classList.remove("invisible");
        License.lspid.innerHTML =  `<p>${key}</p>`;
        License.clear_LicenseInfo(prop);
        License.newlicense_id.value = "";
        // document.getElementById("Lspid").style.color = 'blue'
    }).catch((err) => {
        License.Spidmsg.classList.remove("invisible");
        License.Spidmsg.innerHTML = err;
    });

  }
  });
   
 
  }


close_customerinfodiv()
{
  License.existing_client.style.display ="none";
  License.clear_existingLicenseinfo();
  License.search_client_input.value = '';
  License.search_client.style.display = 'block';
  License.exkey_div.classList.add("invisible");

}

close_LicenseKeydiv()
{  
    // sessionStorage.removeItem("token");
    // License.clear_LicenseInfo(prop);
    License.Spidmsg.classList.add("invisible"); 
    License.liclogin_div.style.display ="none";
    var prop = License.Liclogin;
    License.clear_LicenseInfo(prop);
    License.key_div.classList.add("invisible");
    License.search_client.style.display ="block";
    License.search_client_input.value = '';
   
}
Logout_LicenseKeydiv()
{
    sessionStorage.removeItem("token");
    License.search_client.style.display = "none";
    License.liclogin_div.style.display ="none";
    License.btn_logout.classList.add("invisible");
    License.existing_client.style.display = "none";
    License.formlogin_div.style.display = "block"; 

}

clear_LicenseInfo(prop)
{
    prop[0].value = "";
    prop[1].value = "";
    prop[2].value = "";
    prop[3].value = "";
    prop[4].value = "";
    prop[5].value = "";
    prop[6].value = "";
    prop[7].value = "";
    prop[8].value = "";
    prop[9].value = "";
    prop[10].value = "";
    prop[11].value = "";
    prop[12].value = "";
    prop[13].value = "";
    prop[14].value = "";
    prop[15].value = "";
}

//Auto COmplete
clientList_autocomplete(inp){
    inp.addEventListener("input" , (e)=>{
        // var key = e.target.value.trim().toLowerCase();
        var key =  inp.value.trim().toLowerCase();
        License.closeAllLists();
        if (!key){return false;}
        let currentFocus = -1;
        // let company_list = []
        if(key.length>2){ 
          FETCHGETAUTH(`${app.LicenseServiceUrl}LicenseGenerator/CustomerAutocomplete?key=${key}`).then((d) => {
          if(!d.isError){
            let a = document.createElement("DIV");
             a.setAttribute("id", License.search_client_input.id +"autocomplete-list" )
             a.setAttribute("class", "autocomplete-items absolute border-b-2 w-full")
             License.search_client_input.parentNode.appendChild(a)
             for(let i=0 ; i<d.listofName.length; i++)
             {
              // company_list.push(d.listofName[i]);
               if(d.listofName[i].toLowerCase().includes(key))
               {
               
                 //DIV for each matching element: 
                 let b = document.createElement("DIV");
                 b.setAttribute("class", " border border-1 px-2  py-2 cursor-pointer hover:bg-slate-200")
                 //matching letters bold:
                  b.innerHTML = "<strong>" + d.listofName[i].substr(0, key.length) + "</strong>";
                  b.innerHTML += d.listofName[i].substr(key.length);
                   b.innerHTML += "<input type='hidden' value='" + d.listofName[i] + "'>";
                  //execute a function when someone clicks on the item value (DIV element):
                  b.addEventListener("click", function(e) {
                  //insert the value for the autocomplete text field
                  inp.value = this.getElementsByTagName("input")[0].value;
                 //close the list of autocompleted values,
                  License.closeAllLists();
                     });
             a.appendChild(b);
           
            }

           }
          //  return company_list
        }
    }).catch((err => {
        
        License.lpid.classList.remove("invisible");
        License.lpid.innerHTML = err;
        License.lpid.style.color = 'red';
    }))
  }     
     /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById("search_client_inputautocomplete-list")
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        License.addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        License.addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
     
  });
  
  /*execute a function when someone clicks in the document:*/
  //  document.addEventListener("click", function (e) {
  //     License.closeAllLists(e.target);
  //  });


})    


}

addActive(x) {
  /*a function to classify an item as "active":*/
  if (!x) return false;
  /*start by removing the "active" class on all items:*/
  License.removeActive(x);
  if (currentFocus >= x.length) currentFocus = 0;
  if (currentFocus < 0) currentFocus = (x.length - 1);
  /*add class "autocomplete-active":*/
  x[currentFocus].classList.add("autocomplete-active");
}
removeActive(x) {
  /*a function to remove the "active" class from all autocomplete items:*/
  for (var i = 0; i < x.length; i++) {
    x[i].classList.remove("autocomplete-active");
  }
}
closeAllLists(elmnt) {
  /*close all autocomplete lists in the document,
  except the one passed as an argument:*/
  var x = document.getElementsByClassName("autocomplete-items");
  for (var i = 0; i < x.length; i++) {
    if (elmnt != x[i] && elmnt != License.search_client_input) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
  License.existing_client.style.display = "none";
  License.lpid.classList.add("invisible");
}

generate_new_license_existingcompany()
{
  var companyname = License.search_client_input.value.trim();
 
  var prop  = License.existing_customer_div;
  var model = {};
  // model.companyName = companyname;
  model.address = 'myaddress';
  model.city = 'city';
  model.stateProvice = 'myprovince';
  model.country = 'country';
  model.zipCode = '60100';
  model.contactTitle = 'contactTitle';
  model.contactPhone = '7894565';
  model.contactFullName = 'ycontact';
  model.contactEmail = 'my@gmail.com';
  model.productName = 'Required';
  model.licenseType = 'Required'
  model.companyName = companyname;
  model.ProductId = prop[0].value;
  model.LicenseTypeEnumid = prop[1].value;
  model.licenseCount = prop[2].value;
  model.expiryDate =  prop[3].value;
  model.database =  prop[4].value;
  model.comment =  prop[5].value;
  var url = `${app.LicenseServiceUrl}LicenseGenerator/GenerateLicenseToExistCustomer`
  FETCHPOSTAUTH(url, model).then((key) => {
    if (key.ok == false) {
        License.exSpidmsg.classList.remove("invisible");
        errorMessages(License.exSpidmsg, key.status);
        if(key.status == 401)
        {
          // License.Logout_LicenseKeydiv();
          License.exSpidmsg.classList.remove("invisible");
          License.exSpidmsg.style.color = 'red';
          errorMessages(License.exSpidmsg, key.status);
        
        }
       
        return;
    }
    if(key.isError == true){ 
      License.exSpidmsg.classList.remove("invisible");
      License.exSpidmsg.innerHTML =  key.message;
      License.clear_existingLicenseinfo();
     return ;
    // document.getElementById("Lspid").style.color = 'blue'
  }
  if (key.isCustomerFound == false)
  {
    License.exkey_div.classList.remove("invisible");
    License.exLspid.innerHTML =  `<p>${key.message}</p>`;
    License.clear_existingLicenseinfo();
  }
}).catch((err) => {
    License.exSpidmsg.classList.remove("invisible");
    License.exSpidmsg.innerHTML = err;
    License.clear_existingLicenseinfo();
});
}

clear_existingLicenseinfo()
{
  
  License.existing_prodid.value = '';
  License.existing_licensetypeid.value = '';
  License.existing_expiryDate_id.value = '';
  License.existing_newdatabaseid.value = '';
  License.existing_comments_id.value = '';
  License.existing_licenseCountid.value = '';
  
}

// getproduct_fornewcustomer()
// {
//     License.lpid.addEventListener("change", (e) => {
//         var id = parseInt(e.currentTarget.value)
//         FETCHGETAUTH(`${app.LicenseServiceUrl}LicenseGenerator/GetListOfLicenseTypes?prodId=${id}`).then((d) => {
//           licensetypeid.innerHTML = ""
//           licensetypeid.innerHTML = `<option>Select Type</option>`
//             d.forEach(e => {
//               licensetypeid.innerHTML += `<option value="${e.enumId}">${e.name}</option>`  //id2
//             });
//         })
//     })

// }



}



// input.addEventListener("input", (data) => {
//     //call api
//     autocomplete(document.getElementById("myInput"), data.listofcompany);


// })
var License = new Licensefuncs();
  License.lpid.classList.add("invisible");
  License.client_search_button.addEventListener("click", (e) =>{
  
    License.client_search_button.display ="block";
    let customer_name = License.search_client_input.value.trim();
    if(customer_name == "" || customer_name == null)
    {

      License.lpid.classList.remove("invisible");
      License.lpid.innerHTML = "Please enter company name.";
      License.lpid.style.color = 'red';
      return;
    }
    FETCHGETAUTH(`${app.LicenseServiceUrl}LicenseGenerator/IsCustomerExist?Customername=${customer_name}`).then((d) => {
    if(d.isCustomerFound){ 
        let customer  = d.customerName;
        License.existing_client.style.display ="none";
        // License.existing_client.style.top ="130px";
        // License.customer_name.innerHTML  = customer;
        License.search_client.style.display = "none";
        License.customer_name.innerHTML ='License generate for' +" "+customer;
        License.existing_client.style.display = "block";
    }
    
    else if(d.isError)
    {
      License.lpid.classList.remove("invisible");
      License.lpid.innerHTML = d.message;
      License.lpid.style.color = 'red';
      return;
    }
    else{
      License.lpid.classList.add("invisible");
      License.newlicense_id.value = License.search_client_input.value;
      License.search_client.style.display = "none";
      License.liclogin_div.style.display = "block"; 
    }
    
    });
  
  }); 
  