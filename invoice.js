const fs = require("fs");
const PDFDocument = require("pdfkit");
var tot;
const FileSaver = require('file-saver');




async function createInvoice(invoice, path) {
  tot = 0;
  let doc = new PDFDocument({ margin: 50 });

  generateHeader(doc);
  generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);

  await doc.end();
  await doc.pipe(await fs.createWriteStream(path));

  return true;

}

function generateHeader(doc) {
  doc
    .image("Group 7.png", 50, 45, { width: 170 })
    .fillColor("#444444")
    .fontSize(20)
    .fontSize(10)
    .font("Helvetica-Bold")

    .text("India Mart Pvt. Ltd", 200, 50, { align: "right" })
    .font("Helvetica")

    .text("P-1307, Main Road No. 3, Sector-46", 200, 65, { align: "right" })
    .text("Gurugram, Haryana 122003", 200, 80, { align: "right" })
    .text("Phone: +91 9310465254, +91 9310465254", 200, 95, { align: "right" })
    .moveDown();


}

function generateFooter(doc) {
  doc
    .fontSize(10)
    .text(
      "Thank you for your business.",
      50,
      700,
      { align: "center", width: 500 }
    );
}

function generateCustomerInformation(doc, invoice) {
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text("Invoice", 50, 160);

  generateHr(doc, 185);


  const shipping = invoice.client;

  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .text(`Invoice Number :`, 50, 200)
    .font("Helvetica")
    .text(`${invoice.invoiceNumber}`, 140, 200)
    .font("Helvetica-Bold")

    .text(`Invoice Date :`, 50, 215)
    .font("Helvetica")

    .text(`${invoice.invoiceDate}`, 140, 215)

    .font("Helvetica-Bold")
    .text(`Customer Name :`, 300, 200)
    .font("Helvetica")
    .text(shipping.company, 400, 200)
    .font("Helvetica-Bold")
    .text(`Delivery :`, 300, 215)
    .font("Helvetica")
    .text(shipping.address, 400, 215)
    .moveDown();

  generateHr(doc, 240);

}

function generateTableRow(doc, y, c1, c2, c3, c4, c5) {
  doc
    .fontSize(10)
    .text(c1, 60, y)
    .text(c2, 110, y)
    .text(c3, -10, y, { align: "center" })
    .text(c4, 350, y, { width: 90, align: "right" })
    .text(c5, 445, y, { width: 90, align: "right" });
}

function generateInvoiceTable(doc, invoice) {
  let i,
    invoiceTableTop = 250;

  doc.font("Helvetica-Bold");

  generateTableRow(
    doc,
    invoiceTableTop,
    "S.No.",
    "Item",
    "Quantity",
    "Price",
    "Total"
  );

  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");
  for (i = 0; i < invoice.products.length; i++) {
    const item = invoice.products[i];
    const position = invoiceTableTop + (i + 1) * 30;
    tot += item.price;
    generateTableRow(
      doc,
      position,
      i + 1,
      item.description,
      item.quantity,
      formatCurrency(Math.round(Number(item.price) / Number(item.quantity))),
      formatCurrency(item.price)
    );

    generateHr(doc, position + 20);

  }

  doc.font("Helvetica-Bold");


  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "",
    "Taxable Amount:",
    formatCurrency(invoice.tot)
  );

  const gst = subtotalPosition + 20;
  generateTableRow(
    doc,
    gst,
    "",
    "",
    "",
    "GST Amount:",
    formatCurrency(0)
  );



  const paidToDatePosition = gst + 22;
  generateTableRow(
    doc,
    paidToDatePosition + 5,
    "",
    "",
    "",
    "Total:",
    formatCurrency(invoice.tot)
  );

  doc.text("Payment Term :", 50, subtotalPosition)
    .font("Helvetica")
    .text("  Advance Payment", 123, subtotalPosition)
    .font("Helvetica-Bold");
  generateHr(doc, paidToDatePosition + 25);
  generateHr(doc, gst + 18);

  doc
    .text("Amount in words : ", 52, paidToDatePosition + 5)
    .font("Helvetica")
    .text(" Rupees " + invoice.amtword + " only", 141, paidToDatePosition + 5)
    .font("Helvetica-Bold")

    .moveDown();

  generateHr(doc, 670);

  doc.text("GSTIN: 06AAECL3163C1ZX    CIN: U22219HR2020PTC088723    E-Mail: contact@indiamart.com", 60, 678)
    .moveDown();
  generateHr(doc, 695);

  doc.text("This is a system generated invoice and does not require signature.", 150, 720)





}

function generateHr(doc, y) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

function formatCurrency(amt) {
  return "Rs. " + amt.toFixed(2);
}

module.exports = {
  createInvoice
};