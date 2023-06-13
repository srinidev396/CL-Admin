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
        License.search_client.style.display ="block";
        License.formlogin_div.style.display = "none";
        // License.search_client.style.display = "block";
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

close_customerinfodiv()
{
  License.existing_client.style.display ="none";
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
        // var key = e.target.value.trim().toLowerCase();
        var key =  inp.value.trim().toLowerCase();
        License.closeAllLists();
        if (!key){return false;}
        let currentFocus = -1;
        if(key.length>2){ 
          FETCHGETAUTH(`${app.LicenseServiceUrl}LicenseGenerator/CustomerAutocomplete?key=${key}`).then((d) => {
          if(!d.isError){
            let a = document.createElement("DIV");
             a.setAttribute("id", License.search_client_input.id +"autocomplete-list" )
             a.setAttribute("class", "autocomplete-items absolute border-b-2 w-full")
             License.search_client_input.parentNode.appendChild(a)
             for(let i=0 ; i<d.listofName.length; i++)
             {
               if(d.listofName[i].toLowerCase().includes(key))
               {
                 //DIV for each matching element: 
                 let b = document.createElement("DIV");
                 b.setAttribute("class", " border border-1 px-2  py-2")
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
  document.addEventListener("click", function (e) {
     License.closeAllLists(e.target);
  });


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
}

generate_license_existing_customer(inp)
{

  inp.addEventListener("click", (e) =>{
    License.client_search_button.display ="block";
    let customer_name = search_client_input.value.trim();
    FETCHGETAUTH(`${app.LicenseServiceUrl}LicenseGenerator/IsCustomerExist?Customername=${customer_name}`).then((d) => {
        if(d.isCustomerFound){ 
        let customer  = d.customerName;
        License.existing_client.style.display ="block";
        License.existing_client.style.top ="130px";
        License.existing_client.innerHTML ="";
        License.existing_client.innerHTML +=` <form>
            <div class="flex flex-row gap-4  w-full mt-4"> 
                <label for="email" class="mb-4 text-xl font-semibold  font-mono text-gray-900">Create License for ${customer}</label>
            </div>
            <div class="grid md:grid-cols-2 md:gap-6">
                <div class="relative z-0 w-full mb-5">
                    <select value="" id="prodid" name="productName" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer">
                        <option value="0">Select Product</option>
                    </select>
                    <!-- <label for="select" class="absolute duration-300 top-3 -z-1 origin-0 text-gray-500">Product</label> -->
                   
                  </div>
            
                  <div class="relative z-0 w-full mb-5">
                    <select value="" id="licensetypeid" name="licenseType" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer">
                        <option>Select Type</option>
                    </select>
                    <!-- <label for="select" class="absolute duration-300 top-3 -z-1 origin-0 text-gray-500">LicenseType</label> -->
                  </div>
            </div>
            <div class="grid md:grid-cols-2 md:gap-6">
                <div class="relative z-0 w-full mb-6 group">
                    <input name="licenseCount" type="text" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required="">
                    <label class="peer-focus:font-medium absolute text-sm font-mono  text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">LicenseCount</label>
                </div>
                <div class="relative z-0 w-full mb-6 group">
                    <input  type="datetime-local" name="expiryDate" class="block py-2.5 px-0 w-full text-medium text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer">
                    <label for="floating_last_name" class="peer-focus:font-sm absolute text-medium peer-focus:-top-0.5 text-gray-500  duration-100 transform -translate-y-6 scale-75 top-2 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Expiry Date</label>
                </div>
            </div>
            <div class="grid md:grid-cols-2 md:gap-6">
                <div class="relative z-0 w-full mb-6 group">
                    <input type="text" name="newlicense" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required="">
                    <label class="peer-focus:font-medium absolute text-sm font-mono  text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Database</label>
                </div>
                <div class="relative z-0 w-full mb-6 group">
                    <input type="text" name="newlicense" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600  focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required="">
                    <label class="peer-focus:font-medium absolute text-sm font-mono  text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Comment</label>
                </div>
            </div>
            <div class="grid grid-cols-2 w-40 gap-2">
                <button type="button" onclick="License.GenerateNewLicense()" value="Execute" class="text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-3 text-center">Execute</button>
                <button id="close-btn" onclick="License.close_customerinfodiv()" value="cancel" type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-3 py-3 hover:text-gray-900 focus:z-10">Cancel</button>
        </div>
        <div id="key_div" class="grid md:grid-cols-1 md:gap-6 bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-2 invisible mt-4">
            
            <p class="font-bold">Your's License Key</p>
             <p id="Lspid" class="text-sm overflow: auto; break-words"></p>
            <!-- <p id="Lspid" style="color: blue; overflow: auto;"></p> -->
       </div>
             </form>`
        
        //   generatelicenseexistingcustomer(customer)
        
    }
    if(d.isError)
    {

       alert(d.message)
    }
    
    });
    
    }); 

}

//


}

// input.addEventListener("input", (data) => {
//     //call api
//     autocomplete(document.getElementById("myInput"), data.listofcompany);


// })
var License = new Licensefuncs();