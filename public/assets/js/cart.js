const cartBtn = document.querySelector(".cart-btn");
const cart = document.querySelector(".popup.cart");
const overlay = document.querySelector(".overlay");
var cartData, dbref;
function openCart() {
  document.querySelector(".loaderBox2").classList.remove("hidden");

  cart.classList.remove("hidden");
  overlay.classList.remove("hidden");
  dbref = db.collection("users").doc(auth.currentUser.uid);
  $("#cart-items").empty();
  dbref.get().then((doc) => {
    cartData = doc.data().cart;
    const elem = document.querySelector("#no");

    if (elem) {
      elem.parentNode.removeChild(elem);
    }
    if (cartData.length == 0) {
      document
        .querySelector(".cart-items")
        .insertAdjacentHTML(
          "beforeend",
          "<div id='no'>No item added to cart</div>"
        );
      document.querySelector(".final-total").innerHTML = "₹ 0";
      document.querySelector(".loaderBox2").classList.add("hidden");
    } else {
      document.querySelector(".loaderBox2").classList.add("hidden");

      cartData.forEach(function (x, n) {
        if (x.name.includes("Coconut") && x.qty == 1) {
          $("#cart-items").append(
            `
          <div id="coast" class="d-flex coast justify-content-between align-items-center" style="margin-top:10px;">
              <div class="left-cart d-flex flex-wrap align-items-center">
                <label class="" for="quantity-one">` +
            x.name +
            `</label>
                <div class="d-flex justify-content-around flex-nowrap">
                  <input style="
                        border-radius: 5px;
                        margin: 0 10px 0 30px;
                        padding: 0px 3px;
                        height: 2em;
                      " class="amount-0" type="number" min="1" value="` +
            x.qty +
            `" disabled />
                  <p class="p-0" style="margin: 4px 40px 0 0; min-width: 40px">
                  bag
                  </p>
                </div>
              </div>
              <div class="right-cart d-flex flex-nowrap align-items-center">
                <p class="final-0" style="margin: 0; white-space: nowrap">
                  ₹ ` +
            x.total +
            `
                </p>
                <i onclick="deleteel(` +
            n +
            `)" class="bi bi-trash-fill"></i>
              </div>
          </div>`
          );
        } else if (x.name.includes("Coconut") && x.qty > 1) {
          $("#cart-items").append(
            `
            <div id="coast" class="d-flex coast justify-content-between align-items-center" style="margin-top:10px;">
                <div class="left-cart d-flex flex-wrap align-items-center">
                  <label class="" for="quantity-one">` +
            x.name +
            `</label>
                  <div class="d-flex justify-content-around flex-nowrap">
                    <input style="
                          border-radius: 5px;
                          margin: 0 10px 0 30px;
                          padding: 0px 3px;
                          height: 2em;
                        " class="amount-0" type="number" min="1" value="` +
            x.qty +
            `" disabled />
                    <p class="p-0" style="margin: 4px 40px 0 0; min-width: 40px">
                    bags
                    </p>
                  </div>
                </div>
                <div class="right-cart d-flex flex-nowrap align-items-center">
                  <p class="final-0" style="margin: 0; white-space: nowrap">
                    ₹ ` +
            x.total +
            `
                  </p>
                  <i onclick="deleteel(` +
            n +
            `)" class="bi bi-trash-fill"></i>
                </div>
            </div>`
          );
        } else if (x.name.includes("Areca") || x.name.includes("Monstera")) {
          $("#cart-items").append(
            `
            <div id="coast" class="d-flex coast justify-content-between align-items-center" style="margin-top:10px;">
                <div class="left-cart d-flex flex-wrap align-items-center">
                  <label class="" for="quantity-one">` +
            x.name +
            `</label>
                  <div class="d-flex justify-content-around flex-nowrap">
                    <input style="
                          border-radius: 5px;
                          margin: 0 10px 0 30px;
                          padding: 0px 3px;
                          height: 2em;
                        " class="amount-0" type="number" min="1" value="` +
            x.qty +
            `" disabled />
                    <p class="p-0" style="margin: 4px 40px 0 0; min-width: 40px">
                    units
                    </p>
                  </div>
                </div>
                <div class="right-cart d-flex flex-nowrap align-items-center">
                  <p class="final-0" style="margin: 0; white-space: nowrap">
                    ₹ ` +
            x.total +
            `
                  </p>
                  <i onclick="deleteel(` +
            n +
            `)" class="bi bi-trash-fill"></i>
                </div>
            </div>`
          );
        } else {
          $("#cart-items").append(
            `
          <div id="coast" class="d-flex coast justify-content-between align-items-center" style="margin-top:10px;">
              <div class="left-cart d-flex flex-wrap align-items-center">
                <label class="" for="quantity-one">` +
            x.name +
            `</label>
                <div class="d-flex justify-content-around flex-nowrap">
                  <input style="
                        border-radius: 5px;
                        margin: 0 10px 0 30px;
                        padding: 0px 3px;
                        height: 2em;
                      " class="amount-0" type="number" min="1" value="` +
            x.qty +
            `" disabled />
                  <p class="p-0" style="margin: 4px 40px 0 0; min-width: 40px">
                    kg
                  </p>
                </div>
              </div>
              <div class="right-cart d-flex flex-nowrap align-items-center">
                <p class="final-0" style="margin: 0; white-space: nowrap">
                  ₹ ` +
            x.total +
            `
                </p>
                <i onclick="deleteel(` +
            n +
            `)" class="bi bi-trash-fill"></i>
              </div>
          </div>`
          );
        }
      });
    }
    var tot = 0;

    for (var i = 0; i < cartData.length; i++) {
      tot = tot + Number(cartData[i].total);
    }
    document.querySelector(".final-total").innerHTML = `₹ ${tot}`;

    const popForm = cart.querySelector("form");
  });
}

function deleteel(n) {
  let initialTotal = Number(
    document.querySelector(".final-total").innerHTML.slice(2)
  );
  var deletedValue;
  deletedValue = cartData[n].total;
  document.querySelector(".final-total").innerHTML = `₹ ${initialTotal - deletedValue
    }`;

  cartData.splice(n, 1);

  dbref.update({ cart: cartData }).then(() => {
    document.querySelector(".final-total").innerHTML = `₹ ${initialTotal - deletedValue
      }`;
    openCart();
  });
}
