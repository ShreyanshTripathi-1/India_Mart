const { static } = require("express");
require("dotenv").config({ path: __dirname + "/.env" });
const { createInvoice } = require("./invoice.js");
const express = require("express");
const app = express();
const numWords = require("num-words");
const fs = require("fs");
const bodyParser = require("body-parser");


var admin = require("firebase-admin");

var serviceAccount = require("./serviceKey.json");

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const db = admin.firestore();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());
app.set("view engine", "ejs");

app.post("/allProducts", async (req, res) => {
  const snapshot = await db.collection("products").doc(req.body.id);
  var docArray = await snapshot.get();
  res.json({ products: docArray?.data()?.products });
});

app.get("/allUsers", async (req, res) => {
  const snapshot = await db.collection("users").get();
  var docArray = await snapshot.docs.map((doc) => ({
    data: doc.data(),
    uid: doc.id,
  }));
  res.json({ doc: docArray });
});

app.post("/invoice", async (req, res) => {
  var config = req.body;

  const amountInWords = numWords(config.tot);
  config.amtword = amountInWords;
  const inv = await createInvoice(config, "invoice.pdf");
  console.log(inv);
  if (inv) {
    res.json({ done: true });
  } else {
    res.json({ done: false });
  }
});

app.get("/download", async (req, res) => {
  await res.download(`${__dirname}/invoice.pdf`, (err) => {
    if (err) {
      fs.unlink("invoice.pdf", () => { });
      console.log(err);
    } else {
      fs.unlink("invoice.pdf", () => { });
      console.log("loll");
    }
  });
});

const port = process.env.PORT || 3000;

app.listen(port);

app.use(static("public"));

app.get("/", (req, res) => {
  res.sendFile("./index.html", { root: __dirname });
});

app.get("/admin", (req, res) => {
  if (req.query.uid == "BfJ63pVMQJNMzQjXshM5oVNoDpb2")
    res.sendFile("/admin.html", { root: __dirname });
  else {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(`<head><link
    href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Nunito:300,300i,400,400i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i"
    rel="stylesheet"
  /></head><center style="font-family:'Nunito'; font-weight:500; "><h2><span style="color:#b83558">No Authorization</span></h2></center><script>function redirect(){setTimeout(() => {window.location = "/";}, 9000);} redirect();</script>`);

    res.end();
  }
});


app.get("/res", (req, res) => {
  res.sendFile("./res.html", { root: __dirname });
});
app.get("/products", (req, res) => {
  res.sendFile("./products.html", { root: __dirname });
});


app.get("/login", (req, res) => {
  res.sendFile("./login.html", { root: __dirname });
});

app.get("/reset", (req, res) => {
  res.sendFile("./reset.html", { root: __dirname });
});

app.get("/signup", (req, res) => {
  res.sendFile("./signup.html", { root: __dirname });
});

app.get("/policy", (req, res) => {
  res.sendFile("./policy.html", { root: __dirname });
});

app.get("/orders", (req, res) => {
  res.sendFile("./orders.html", { root: __dirname });
});

app.get("/success", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write(`<head><link
    href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Nunito:300,300i,400,400i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i"
    rel="stylesheet"
  /></head><center style="font-family:'Nunito'; font-weight:500; "><h2><span style="color:#4BB543">Transaction Successfull</span><br>You will be redirected shortly</h2></center><script>function redirect(){setTimeout(() => {window.location = "/orders";}, 2000);} redirect();</script>`);

  res.end();
});

