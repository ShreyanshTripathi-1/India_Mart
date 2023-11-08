function newUser(name, email, phone, password) {
  (this.name = name),
    (this.email = email),
    (this.phone = phone),
    (this.password = password),
    (this.orders = []);
}

function signup() {
  const signupForm = document.querySelector(".create");
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const errbox = document.querySelectorAll(".form-err");
    errbox.forEach((el) => {
      el.classList.add("hidden");
    });

    const name = signupForm["name"].value;
    const phone = signupForm["mobile"].value;
    const email = signupForm["email"].value;
    const password = signupForm["password"].value;
    const user = new newUser(name, email, phone, password);
    auth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then((cred) => {
        // console.log(cred);
        db.collection("users")
          .doc(cred.user.uid)
          .set({
            name: user.name,
            email: user.email,
            phone: user.phone,
            orders: user.orders,
            cart: [],
            status: "pending",
            rate: 0
          })
          .then(() => {
            alert("You have successfully created an account");
            signupForm.reset();
            window.location = "/products";
          });
      })

      .catch((err) => {
        if (err.message.includes("email")) {
          const err = document.querySelector("#emailerr");
          err.classList.remove("hidden");
          err.innerHTML = "This email already exists";
        }
      });
  });
}

// LOGIN

function login() {
  const loginForm = document.querySelector(".login");
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const errors = document.querySelectorAll(".form-err");
    errors.forEach((el) => {
      el.classList.add("hidden");
    });
    const email = loginForm["email"].value;
    const password = loginForm["password"].value;
    console.log(email, password);
    auth
      .signInWithEmailAndPassword(email, password)
      .then((cred) => {
        loginForm.reset();
        window.location = "/products";
      })
      .catch((err) => {
        console.log(err);
        if (err.message.includes("INVALID")) {
          const errBox = document.querySelector("#passHelp");
          errBox.classList.remove("hidden");
          errBox.innerHTML = "Invalid Credentials";
        }
      });
  });
}

//Forgot Password
function forgot() {
  const forgotForm = document.querySelector(".forgot");
  forgotForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const errors = document.querySelectorAll(".form-err");
    errors.forEach((el) => {
      el.classList.add("hidden");
    });
    const email = forgotForm["email"].value;
    auth.sendPasswordResetEmail(email).then(function () {
      window.alert("An email has been sent to you. Please check and verify.");

    })
      .catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;

        console.log(errorCode);
        console.log(errorMessage);

        window.alert("Error : " + errorMessage);
      });

  });
}
// Logged In User

function DOMLogout(user, status, n) {
  const navbtns = document.querySelectorAll(".nav-btn");
  const loggedInElements = [...document.querySelectorAll(".logout")];
  console.log(loggedInElements)

  if (user) {
    navbtns.forEach((el) => {
      el.classList.add("hidden");
    });
    if (loggedInElements.length > 0) {
      loggedInElements[0] && loggedInElements[0].classList.remove("hidden");
      loggedInElements[1] && loggedInElements[1].classList.remove("hidden");
      if (status != "v" && n == 1)
        document.querySelector('.cart-btn').classList.add('hidden');
    }
  } else {
    navbtns.forEach((el) => {
      el.classList.remove("hidden");
    });
    if (loggedInElements.length > 0) {
      loggedInElements[0] && loggedInElements[0].classList.add("hidden");
      loggedInElements[1] && loggedInElements[1].classList.add("hidden");
    }
  }
}

function loggedIn(n) {
  var status;
  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log(user.uid);
      db.collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          const profileName = doc.data().name;

          if (n == 1) {
            userData = doc.data();
            if (doc.data().status == 'pending') {
              status = "p";
              const alert = document.querySelector(".alert2");
              document.querySelector('.cart-btn').classList.add('hidden');
              alert.classList.remove("hidden");
              setTimeout(() => {
                alert.classList.add("hidden");
              }, 6000);
            } else if (doc.data().status == 'verified') {
              status = "v";
              document.querySelector('.cart-btn').classList.remove('hidden');
            } else {
              status = "d";
              const alert = document.querySelector(".alert3");
              document.querySelector('.cart-btn').classList.add('hidden');
              alert.classList.remove("hidden");
              setTimeout(() => {
                alert.classList.add("hidden");
              }, 6000);
            }

          }


          if (user.uid == 'BfJ63pVMQJNMzQjXshM5oVNoDpb2') {
            document.getElementById('admin').classList.remove('hidden');
          }
          document.querySelector(
            ".profile-name"
          ).innerHTML = `<i style="font-size: 25px; margin-right: 10px" class="bi bi-person-circle"></i> ${profileName}`;
          DOMLogout(user, status, n);
        });
    } else {
      DOMLogout(user);
      console.log(document.querySelectorAll(".nav-btn"));
    }
  });
}

function logout() {
  auth.signOut().then(() => {
    window.location = "/login";
  });
}
