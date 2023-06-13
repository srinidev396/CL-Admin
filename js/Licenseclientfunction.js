class Licensefuncs {
constructor(){
   this.formlogin_div = document.getElementById("frmlogin_div");
   this.liclogin_div = document.getElementById("liclogin_div");
   this.lpid =  document.getElementById("Lpid");
   this.Spidmsg =  document.getElementById("Spidmsg");
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
   this.search_client_p = document.getElementById(" search_client_p");
  
   
}

GetToken() {
    License.lpid.classList.add("invisible");
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
    
        License.formlogin_div.style.display = "none";
        License.search_client.style.display = "block";
        // License.search_client.classList.remove("invisible");
        sessionStorage.setItem("token", data);
        FETCHGETAUTH(`${app.LicenseServiceUrl}LicenseGenerator/GetListOfProducts`).then((d) => {
            License.prodid.innerHTML = ""
            License.prodid.innerHTML = `<option value="0">Select Product</option>`
            d.forEach(e => {
                License.prodid.innerHTML += `<option value="${e.id}">${e.name}</option>`
            });
        })
    }).catch((err => {
        debugger
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


GenerateNewLicense() {
    License.Spidmsg.classList.add("invisible");
    var prop = document.getElementById("Liclogin");
    var model = {};
    model.companyName = prop[0].value;
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
        // document.getElementById("Lspid").style.color = 'blue'
    }).catch((err) => {
        License.Spidmsg.classList.remove("invisible");
        License.Spidmsg.innerHTML = err;
    });
}

close_LicenseKeydiv()
{  
    sessionStorage.removeItem("token");
    License.Spidmsg.classList.add("invisible"); 
    License.liclogin_div.style.display ="none";
    License.formlogin_div.style.display = "block"; 
    // License.formlogin_div.classList.add("visible"); 
}

Logout_LicenseKeydiv()
{
    sessionStorage.removeItem("token");
    License.search_client.style.display = "none";
    // License.liclogin_div.style.display ="none";
    License.btn_logout.classList.add("invisible");
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
        var key = e.target.value.trim().toLowerCase();
        if (!key){return false;}
        let currentFocus = -1;
        if(key.length>=2){ 
          FETCHGETAUTH(`${app.LicenseServiceUrl}LicenseGenerator/CustomerAutocomplete?key=${key}`).then((d) => {
          if(!d.isError){
            let a = document.createElement("DIV");
             a.setAttribute("id", License.search_client_input.id +"autocomplete-list" )
             a.setAttribute("class", "autocomplete-items absolute border-b-2 w-full")
             License.search_client_input.parentNode.appendChild(a)
             for(let i=0 ; i<d.listofName.length; i++)
             {
               if(d.listofName[i].substr(0, key.length).toUpperCase() == key.toUpperCase())
               {
                 /*create a DIV element for each matching element:*/ 
                 let b = document.createElement("DIV");
                 b.setAttribute("class", "px-2  py-2")
                 /*make the matching letters bold:*/
                  b.innerHTML = "<strong>" + d.listofName[i].substr(0, key.length) + "</strong>";
                  b.innerHTML += d.listofName[i].substr(key.length);
                  /*insert a input field that will hold the current array item's value:*/
                   b.innerHTML += "<input type='hidden' value='" + d.listofName[i] + "'>";
                  /*execute a function when someone clicks on the item value (DIV element):*/
                  b.addEventListener("click", function(e) {
                  /*insert the value for the autocomplete text field:*/
                  inp.value = this.getElementsByTagName("input")[0].value;
                 /*close the list of autocompleted values,
                  (or any other open lists of autocompleted values:*/
                   closeAllLists();
                     });
             a.appendChild(b);
            }

           }
          
          
        }
        else{
            alert("Company Name is not found!")
            // Send users for to create License
            License.search_client.style.display = "none";
            License.liclogin_div.style.display = "block"; 

        }
        
    }).catch((err => {
        alert(err)
        // debugger
        // License.lpid.classList.remove("invisible");
        // License.lpid.innerHTML = err;
        // License.lpid.style.color = 'red';
    }))
  }
 // Check if submit button is clicked , Then display only License  details.
     
     /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(License.search_client_input.id + "search_client_inputautocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
   
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }

  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });


})    


}

}

// input.addEventListener("input", (data) => {
//     //call api
//     autocomplete(document.getElementById("myInput"), data.listofcompany);


// })
var License = new Licensefuncs();