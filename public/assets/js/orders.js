auth.onAuthStateChanged((user) => {
  if (user) {
    displayOrders(user);
  } else {
    window.location = "/login";
  }
});

var dbRef;
var orders;
var username;

function displayOrders(user) {
  dbRef = db.collection("users").doc(user.uid);
  dbRef.get().then((doc) => {
    orders = doc.data().orders;
    username = doc.data().name;

    const container = document.querySelector(".orders-cont");
    if (orders.length == 0) {
      container.innerHTML = "<p>No orders yet.</p>";
      return;
    }
    let i = 0;

    orders.forEach((el, n) => {
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
        class="west-coast d-flex flex-nowrap justify-content-between">
        <div class="left-item">
          <p id="pName" style="text-align: left; line-height:2;">
          ${itemList}
          </p>
        </div>
        <div class="right-item d-flex flex-nowrap">
          <p id="qty" style="line-height:2;">${qtyList}</p>
          <p id="date" style="line-height:2;">${el.date}</p>
          <p id="time" style="line-height:2;">${formattedTime} </p>
          <p id="price" style="line-height:2;">₹ ${totAmt}</p>
          <p class="invoice" id="invoice-${n}" onclick="downloadInvoice(${n})" style="line-height:2;">Download Invoice</p>
        </div>
      </div>
    </div>
      `);
      //  container.insertAdjacentHTML("beforeend", html);



    });
  });
}

async function downloadInvoice(n) {




  const alert = document.querySelector(".alert");
  alert.classList.remove("hidden");
  setTimeout(() => {
    alert.classList.add("hidden");
  }, 4000);

  var tot = 0;

  var products = [];
  orders[n].items.forEach((x) => {
    if (x.quantity > 0)
      products.push({
        quantity: x.quantity,
        description: x.pName,
        tax: 0,
        price: x.cost
      });

    tot = tot + x.cost;

  });

  var date = orders[n].date.substr(0, 2);
  var mo = orders[n].date.substr(3, 2);
  var yr = orders[n].date.substr(8, 2);
  var hr, min;
  var formattedTime = new Date(Number(orders[n].orderId.slice(4))).toLocaleTimeString("en-US");
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




  var config = {
    //"documentTitle": "RECEIPT", //Defaults to INVOICE
    currency: "INR",
    taxNotation: "gst", //or gst
    marginTop: 25,
    marginRight: 25,
    marginLeft: 25,
    marginBottom: 25,
    logo: "https://indiamart.up.railway.app/assets/img/Group 7.png", //or base64
    //"logoExtension": "png", //only when logo is base64
    sender: {
      company: "IndiaMart Private Limited",
      address: "P-1307, Main Road No. 3",
      zip: "Haryana 122003",
      city: "Sector 46, Gurugram",
      country: "India",
      custom1: "Phone: +91 9711921414, +91 9977048049",
      //"custom2": "custom value 2",
      //"custom3": "custom value 3"
    },
    client: {
      company: `${username
        }`,
      address: `${orders[n].address || "Pickup from booth"}`,
      zip: "",
      city: "",
      country: "",
      //"custom1": "custom value 1",
      //"custom2": "custom value 2",
      //"custom3": "custom value 3"
    },
    invoiceNumber: `LS/20-21/${invno}`,
    invoiceDate: `${orders[n].date}`,
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
