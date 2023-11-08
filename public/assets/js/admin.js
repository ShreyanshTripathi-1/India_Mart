auth.onAuthStateChanged((user) => {
    if (user) {

        if (user.uid != 'UMTOD10s3dR64T2RInauDqBLGOo2') {
            window.location = '/err';
        }
        displayUsers(user);
    } else {
        window.location = "/login";
    }
});

var dbRef;
var orders;
var username;
let odate,
    cdate;
var promiseUsers = [];
var globalOrders;
var date;
var gUsers = [];
var reqArray = [];
let k = 0;

const crosses = [...document.querySelectorAll(".cross")];
crosses.forEach((cross) => {
    cross.addEventListener("click", (e) => {
        e.target.parentNode.parentNode.classList.add("hidden");
        document.querySelector('.overlay').classList.add("hidden");
        k = 0;
    });
});

function showneworders(m) {
    var orders = globalOrders;
    if (globalOrders.length > 5) {

        if (m == "n") {
            k = k + 5;
            if (k >= orders.length) {
                k = k - 5;
                return;
            }

        } else if (m == "p") {
            k = k - 5;
            if (k < 0) {
                k = 0;
                return;
            }
        }
        $("#orders").empty();
        console.log(k)
        let f;
        if (k + 5 > orders.length) {
            f = orders.length;
        }
        else
            f = k + 5;
        for (var n = k; n < f; n++) {
            var el = orders[n];

            var formattedTime = new Date(Number(el.orderId.slice(4))).toLocaleTimeString("en-US");

            var itemList = "";
            el.items.forEach((x) => {
                if (x.quantity > 0)
                    itemList = itemList.concat(x.pName + " <br>");

            });

            var qtyList = "";
            el.items.forEach((x) => {
                if (x.quantity > 0) {
                    if (x.pName.includes("Coconut") && x.quantity > 1)
                        qtyList = qtyList.concat(x.quantity + " bags <br>");
                    else if (x.pName.includes("Coconut") && x.quantity == 1)
                        qtyList = qtyList.concat(x.quantity + " bag <br>");
                    else if (x.pName.includes("Palm") || x.pName.includes("Monstera"))
                        qtyList = qtyList.concat(x.quantity + " units <br>");
                    else
                        qtyList = qtyList.concat(x.quantity + " kg <br>");

                }


            });

            var totAmt = 0;
            el.items.forEach((x) => {
                totAmt = totAmt + x.cost;
            });


            $("#orders").append(`
    <div class="orders-items d-flex flex-column flex-nowrap">
    <div
      class="west-coast1 d-flex flex-nowrap justify-content-between">
        <div class="left-head">
        <p id="date" style="text-align: left">${n + 1
                }</p>
        <p id="date" >${el.date
                }</p>
        </div>

        <p id="time" >${formattedTime} </p>
        <p id="price" >₹ ${totAmt}</p>
        <p class="invoice" id="invoice-${n}" onclick="downloadInvoice(${n})" >Download</p>
    </div>
  </div>
    `);
            // container.insertAdjacentHTML("beforeend", html);
        }

    }
}
function showorders(uid) {

    document.querySelector('.popup.orders').classList.remove('hidden');
    document.querySelector('.overlay').classList.remove('hidden');
    $("#orders").empty();
    var i = gUsers.findIndex(x => x.uid === uid);
    var orders = gUsers[i].data.orders;

    globalOrders = orders;
    curViewiD = uid;

    let k;
    if (orders.length == 0) {
        $("#orders").append(`
      <div class="d-flex justify-content-center" style="margin-top:15px">No orders found</div>`);

    } else {
        if (orders.length < 5)
            k = orders.length;
        else
            k = 5;

        for (var n = 0; n < k; n++) {
            var el = orders[n];

            var formattedTime = new Date(Number(el.orderId.slice(4))).toLocaleTimeString("en-US");

            var itemList = "";
            el.items.forEach((x) => {
                if (x.quantity > 0)
                    itemList = itemList.concat(x.pName + " <br>");

            });

            var qtyList = "";
            el.items.forEach((x) => {
                if (x.quantity > 0) {
                    if (x.pName.includes("Coconut") && x.quantity > 1)
                        qtyList = qtyList.concat(x.quantity + " bags <br>");
                    else if (x.pName.includes("Coconut") && x.quantity == 1)
                        qtyList = qtyList.concat(x.quantity + " bag <br>");
                    else if (x.pName.includes("Palm") || x.pName.includes("Monstera"))
                        qtyList = qtyList.concat(x.quantity + " units <br>");
                    else
                        qtyList = qtyList.concat(x.quantity + " kg <br>");

                }


            });

            var totAmt = 0;
            el.items.forEach((x) => {
                totAmt = totAmt + x.cost;
            });


            $("#orders").append(`
    <div class="orders-items d-flex flex-column flex-nowrap">
    <div
      class="west-coast1 d-flex flex-nowrap justify-content-between">
        <div class="left-head">
        <p id="date" style="text-align: left">${n + 1
                }</p>
        <p id="date" >${el.date
                }</p>
        </div>

        <p id="time" >${formattedTime} </p>
        <p id="price" >₹ ${totAmt}</p>
        <p class="invoice" id="invoice-${n}" onclick="downloadInvoice(${n})" >Download</p>
    </div>
  </div>
    `);
            // container.insertAdjacentHTML("beforeend", html);
        }
    }


}
function verify() {
    document.querySelector('.popup.cart').classList.remove('hidden');
    document.querySelector('.overlay').classList.remove('hidden');
    $("#requests").empty();

    if (reqArray.length == 0) {
        $("#requests").append(`
    <div class="d-flex justify-content-center" style="margin-top:10px">No pending requests</div>`);
    }

    reqArray.forEach((x, n) => {

        $("#requests").append(`
    <div id="item` + n + `" class="d-flex coast justify-content-between align-items-center" style="margin-top:10px; padding-bottom: 5px; border-bottom: 2px solid #e0e0e0;">
        <div class="left-cart d-flex flex-wrap align-items-center">
          <label class="" for="quantity-one">` + x.name + `</label>
          </div>
        
        <div class="right-cart d-flex flex-nowrap align-items-center">
          <a onclick="progress('` + x.uid + `','acc',` + n + `)" class="final-0" style="margin-right: 10px; white-space: nowrap">
            Accept
          </a>
          <i onclick="progress('` + x.uid + `','dec',` + n + `)"  style="padding-bottom:5.5%" class="bi bi-trash-fill"></i>
        </div>
    </div>`);

    });

}

function progress(uid, res, n) {
    document.getElementById('item' + n).classList.add('hidden');
    reqArray.splice(n, 1)
    if (reqArray.length == 0) {
        $("#requests").append(`
    <div class="d-flex justify-content-center" style="margin-top:10px">No pending requests</div>`);

    }
    var i = gUsers.findIndex(x => x.uid === uid);
    gUsers[i].data.status = "verified";
    if (res == "acc") {
        db.collection('users').doc(uid).update({ status: "verified" }).then(() => {
            gUsers[i].data.status = "verified";

        })
    } else {
        db.collection('users').doc(uid).update({ status: "decline" }).then(() => {
            gUsers[i].data.status = "decline";

        })

    }

}

function updateDate() {
    var dateControl = document.querySelector('input[type="date"]');

    date = dateControl.value.replace(/-/g, "/").split("/").reverse().join("/");


}

function displayUsers() {
    $("#users").empty();

    $("#all-users").empty();

    var dateControl = document.querySelector('input[type="date"]');

    date = dateControl.value.replace(/-/g, "/").split("/").reverse().join("/");


    getUsers().then((users) => {
        document.getElementById('selection').style.pointerEvents = 'auto';

        if (reqArray.length > 0)
            document.getElementById('accreq').innerHTML += " (" + (
                reqArray.length
            ) + ")";


        document.querySelector('.loaderBox').classList.add('hidden');
        promiseUsers = users;
        users.forEach((el) => {


            $("#users").append(`
      <div class="orders-items d-flex flex-column flex-nowrap">
      <div
        class="west-coast d-flex flex-nowrap justify-content-between">
        <div class="left-item">
          <p id="pName" style="text-align: left; line-height:2;">
          ${el.name
                }
          </p>
        </div>
        <div class="right-item d-flex flex-nowrap">      
          <p class="invoice" onclick="downloadExcel('${el.uid
                }')" style="line-height:2;">Download Excel</p>
        </div>
      </div>
    </div>
      `);

            // container.insertAdjacentHTML("beforeend", html);


        });


    });

}

var curViewiD;

function viewUser(uid) {

    document.querySelector('.popup.userInfo').classList.remove('hidden');
    document.querySelector('.overlay').classList.remove('hidden');
    $("#user-info").empty();

    var i = gUsers.findIndex(x => x.uid === uid);
    curViewiD = gUsers[i].uid;

    var rate = 0;
    var chk1,
        chk2,
        chk3;
    if (gUsers[i].data.status == "verified") {
        chk1 = "selected";
    } else if (gUsers[i].data.status == "decline") {
        chk2 = "selected";
    } else if (gUsers[i].data.status == "pending") {
        chk3 = "selected";
    }

    if (gUsers[i].data.rate) {
        rate = gUsers[i].data.rate;
    }


    $("#user-info").append(`
    <div  class="d-flex coast justify-content-between align-items-center" style="margin-top:10px; padding-bottom: 5px; border-bottom: 2px solid #e0e0e0;">
        <div class="left-cart d-flex flex-wrap align-items-center">
          <label class="" >Name :</label>
          </div>
        
        <div class="right-cart d-flex flex-nowrap align-items-center">
        <label class="" >` + gUsers[i].data.name + `</label>

        </div>
    </div>
    
    <div  class="d-flex coast justify-content-between align-items-center" style="margin-top:10px; padding-bottom: 5px; border-bottom: 2px solid #e0e0e0;">
        <div class="left-cart d-flex flex-wrap align-items-center">
          <label class="" >Email :</label>
          </div>
        
        <div class="right-cart d-flex flex-nowrap align-items-center">
        <label class="" >` + gUsers[i].data.email + `</label>

        </div>
    </div>
    <div  class="d-flex coast justify-content-between align-items-center" style="margin-top:10px; padding-bottom: 5px; border-bottom: 2px solid #e0e0e0;">
    <div class="left-cart d-flex flex-wrap align-items-center">
      <label class="" >Phone :</label>
      </div>
    
    <div class="right-cart d-flex flex-nowrap align-items-center">
    <label class="" >` + gUsers[i].data.phone + `</label>

    </div>
</div>
<div  class="d-flex coast justify-content-between align-items-center" style="margin-top:10px; padding-bottom: 5px; border-bottom: 2px solid #e0e0e0;">
<div class="left-cart d-flex flex-wrap align-items-center">
  <label class="" >Status :</label>
  </div>

<div class="right-cart d-flex flex-nowrap align-items-center">

<div class="form-group" >
  <select class="form-control" style="background-position-y :10px; background-position-x :95%; padding-right:30px; margin-top:0" id="status-list" value="Verified">
    <option value="verified" ` + chk1 + ` >Verified</option>
    <option value="decline" ` + chk2 + `>Decline</option>
    <option value="pending" ` + chk3 + `>Pending</option>
  </select>
</div>
</div>
</div>
<div  class="d-flex coast justify-content-between align-items-center" style="margin-top:10px; padding-bottom: 5px; border-bottom: 2px solid #e0e0e0;">
<div class="left-cart d-flex flex-wrap align-items-center">
  <label class="" >No. of orders :</label>
  </div>

<div class="right-cart d-flex flex-nowrap align-items-center">
<label class="" >` + gUsers[i].data.orders.length + `</label>

</div>
</div>

<div  class="d-flex coast justify-content-between align-items-center" style="margin-top:10px; padding-bottom: 5px; border-bottom: 2px solid #e0e0e0;">
<div class="left-cart d-flex flex-wrap align-items-center">
  <label class="" >MDR Rate :</label>
  </div>

<div class="right-cart d-flex flex-nowrap align-items-center">
<div class="d-flex justify-content-around flex-nowrap">
                  <input style="
                  background:#fff; border-color:#EBEBEB;
                        border-radius: 5px;
                        width:70px;
                        padding: 0px 3px;
                        height: 2em;
                      " class="mdr-rate" type="number" value="${rate}"  />
                  <p class="p-0" style="margin-left:10px; margin-top:5px">
                  %
                  </p>
                </div>

</div>
</div>    
    
    `);


}

function updatemdr() {

    db.collection('users').doc(curViewiD).update({
        rate: Number(document.querySelector('.mdr-rate').value),
        status: document.getElementById('status-list').value
    }).then(() => {
        alert("Updated successfully.");
        gUsers[gUsers.findIndex(x => x.uid === curViewiD)].data.status = document.getElementById('status-list').value;
        gUsers[gUsers.findIndex(x => x.uid === curViewiD)].data.rate = Number(document.querySelector('.mdr-rate').value);
    });

}

async function getUsers() {

    const res = await fetch('/allUsers', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    let response = await res.json();
    let docArray = response.doc;
    var userarray = [];
    gUsers = docArray;

    docArray.forEach((x) => {
        console.log(x)
        if (x.data.orders.length > 0)
            userarray.push({ name: x.data.name, uid: x.uid })



    })
    gUsers.forEach((x) => {
        if (x.data.status == "pending") {
            reqArray.push({ name: x.data.name, uid: x.uid });
        }
    });
    return userarray;
}

function downloadExcel(uid) {
    var userData = [];
    var orders = [];
    var i,
        hr,
        min,
        sec;
    let formattedTime,
        formattedTime1;
    let userObject = {};
    let items;
    var tot1 = 0;
    var tot2 = 0;
    var tot3 = 0;
    var tot4 = 0;
    var index = gUsers.findIndex(x => x.uid === uid);


    orders = gUsers[index].data.orders;
    formattedTime = new Date(new Date().getTime()).toLocaleTimeString("en-US");
    if (formattedTime.substr(2, 1) == ':') {
        if (formattedTime.substr(9, 2) == "PM")
            hr = Number(formattedTime.substr(0, 2)) + 12;
        else {
            if (formattedTime.substr(0, 2) == '12')
                hr = 00;
            else
                hr = Number(formattedTime.substr(0, 2));

        } min = formattedTime.substr(3, 2);

        sec = formattedTime.substr(6, 2);
    } else {
        if (formattedTime.substr(8, 2) == "PM")
            hr = Number(formattedTime.substr(0, 1)) + 12;
        else
            hr = "0" + Number(formattedTime.substr(0, 1));
        min = formattedTime.substr(2, 2);
        sec = formattedTime.substr(5, 2);

    }
    var time = hr + ":" + min + ":" + sec;


    for (i = 0; i < orders.length; i++) {


        if (process(orders[i].date) < process(date)) {
            break;
        }


        if (process(orders[i].date).getTime() == process(date).getTime()) {
            formattedTime1 = new Date(Number(orders[i].orderId.slice(4))).toLocaleTimeString("en-US");
            if (formattedTime1.substr(2, 1) == ':') {
                if (formattedTime1.substr(9, 2) == "PM")
                    hr = Number(formattedTime1.substr(0, 2)) + 12;
                else {
                    if (formattedTime1.substr(0, 2) == '12')
                        hr = 00;
                    else
                        hr = Number(formattedTime1.substr(0, 2));

                } min = formattedTime1.substr(3, 2);

                sec = formattedTime1.substr(6, 2);
            } else {
                if (formattedTime1.substr(8, 2) == "PM")
                    hr = Number(formattedTime1.substr(0, 1)) + 12;
                else
                    hr = "0" + Number(formattedTime1.substr(0, 1));
                min = formattedTime1.substr(2, 2);
                sec = formattedTime1.substr(5, 2);

            }
            var orderTime = hr + ":" + min + ":" + sec;


            if (orderTime < "12:00:00" && orderTime > "00:00:00") {
                items = orders[i].items;
                items.forEach((x) => {
                    tot1 = tot1 + x.cost;
                });
            } else if (orderTime > "12:00:00" && orderTime < "15:00:00") {
                items = orders[i].items;
                items.forEach((x) => {
                    tot2 = tot2 + x.cost;
                });
            } else if (orderTime > "15:00:00" && orderTime < "18:00:00") {
                items = orders[i].items;
                items.forEach((x) => {
                    tot3 = tot3 + x.cost;
                });
            } else if (orderTime > "18:00:00" && orderTime < "23:59:59") {
                items = orders[i].items;
                items.forEach((x) => {
                    tot4 = tot4 + x.cost;
                });
            }

        }
    }
    userData = [{
        name: gUsers[index].data.name,
        phone: gUsers[index].data.phone,
        block1: (tot1 - (gUsers[index].data.rate / 100) * tot1),
        block2: (tot2 - (gUsers[index].data.rate / 100) * tot2),
        block3: (tot3 - (gUsers[index].data.rate / 100) * tot3),
        block4: (tot4 - (gUsers[index].data.rate / 100) * tot4),
        date: date
    }];

    console.log(userData);
    createExcel((userData), gUsers[index].data);


}
function createExcel(userData, user) {
    var sheet_1_data = [{
        "Name": user.name,
        "Email": user.email,
        "Phone": user.phone,
        "Date": userData[0].date,
        "Block-1": userData[0].block1,
        "Block-2": userData[0].block2,
        "Block-3": userData[0].block3,
        "Block-4": userData[0].block4,
        "Total": userData[0].block1 + userData[0].block2 + userData[0].block3 + userData[0].block4
    }];
    var opts = [{
        sheetid: 'Sheet One',
        header: true
    }];
    var result = alasql('SELECT * INTO XLSX("userFile.xlsx",?) FROM ?', [opts, [sheet_1_data]]);
}

function process(date) {
    var parts = date.split("/");
    return new Date(parts[2], parts[1] - 1, parts[0]);
}

function s2ab(s) {
    var buf = new ArrayBuffer(s.length); // convert s to arrayBuffer
    var view = new Uint8Array(buf); // create uint8array as viewer
    for (var i = 0; i < s.length; i++)
        view[i] = s.charCodeAt(i) & 0xFF;
    // convert to octet
    return buf;
}

async function downloadInvoice(n) {


    const alert = document.querySelector(".alert");
    alert.classList.remove("hidden");
    setTimeout(() => {
        alert.classList.add("hidden");
    }, 4000);

    var tot = 0;

    var products = [];
    globalOrders[n].items.forEach((x) => {
        if (x.quantity > 0)
            products.push({ quantity: x.quantity, description: x.pName, tax: 0, price: x.cost });


        tot = tot + x.cost;

    });

    var date = globalOrders[n].date.substr(0, 2);
    var mo = globalOrders[n].date.substr(3, 2);
    var yr = globalOrders[n].date.substr(8, 2);
    var hr,
        min;
    var formattedTime = new Date(Number(globalOrders[n].orderId.slice(4))).toLocaleTimeString("en-US");
    if (formattedTime.substr(2, 1) == ':') {
        if (formattedTime.substr(9, 2) == "PM")
            hr = Number(formattedTime.substr(0, 2)) + 12;
        else
            hr = Number(formattedTime.substr(0, 2));
        min = formattedTime.substr(3, 2);

    } else {
        if (formattedTime.substr(8, 2) == "PM")
            hr = Number(formattedTime.substr(0, 1)) + 12;
        else
            hr = Number(formattedTime.substr(0, 1));
        min = formattedTime.substr(2, 2);

    }


    var invno = date + mo + yr + hr + min;


    var i = gUsers.findIndex(x => x.uid === curViewiD);


    var config = {
        // "documentTitle": "RECEIPT", //Defaults to INVOICE
        currency: "INR",
        taxNotation: "gst", // or gst
        marginTop: 25,
        marginRight: 25,
        marginLeft: 25,
        marginBottom: 25,
        logo: "https://lorenesolutions.com/assets/img/Group 7.png",
        // or base64
        // "logoExtension": "png", //only when logo is base64
        sender: {
            company: "IndiaMart Private Limited",
            address: "P-1307, Main Road No. 3",
            zip: "Haryana 122003",
            city: "Sector 46, Gurugram",
            country: "India",
            custom1: "Phone: +91 9711921414, +91 9977048049",
            // "custom2": "custom value 2",
            // "custom3": "custom value 3"
        },
        client: {
            company: `${gUsers[i].data.name
                }`,
            address: `${globalOrders[n].address || "Pickup from booth"
                }`,
            zip: "",
            city: "",
            country: "",
            // "custom1": "custom value 1",
            // "custom2": "custom value 2",
            // "custom3": "custom value 3"
        },
        invoiceNumber: `LS/20-21/${invno}`,
        invoiceDate: `${globalOrders[n].date
            }`,
        products: products,
        bottomNotice: "",
        tot: tot,
        amtword: ""
    };

    const res = await fetch('/invoice', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
    });

    const data = await res.json();
    if (data.done) {
        setTimeout(() => {
            $("#jusNull")[0].click();

        }, 4000);


    }


}
