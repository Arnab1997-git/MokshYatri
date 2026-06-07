import jsPDF from "jspdf";

export function generateQuotationPdf(
  quotation: any
) {

  const finalPrice =
    quotation.quoted_price ??
    quotation.selling_price;

  const doc = new jsPDF();

  // Header background

  doc.setFillColor(
    6,
    182,
    212
  );

  doc.rect(
    0,
    0,
    210,
    35,
    "F"
  );

  doc.setTextColor(
    255,
    255,
    255
  );

  doc.setFontSize(24);

  doc.text(
    "MOKSH YATRI",
    20,
    20
  );

  doc.setFontSize(12);

  doc.text(
    "Travel Quotation",
    20,
    28
  );

  // Reset text color

  doc.setTextColor(
    17,
    24,
    39
  );

  let y = 50;

  // Customer section

  doc.setFontSize(14);

  doc.text(
    "CUSTOMER DETAILS",
    20,
    y
  );

  y += 8;

  doc.line(
    20,
    y,
    190,
    y
  );

  y += 10;

  doc.setFontSize(12);

  doc.text(
    `Name: ${quotation.customer_name}`,
    20,
    y
  );

  y += 8;

  doc.text(
    `Phone: ${
      quotation.customer_phone || "-"
    }`,
    20,
    y
  );

  y += 18;

  // Package section

  doc.setFontSize(14);

  doc.text(
    "PACKAGE DETAILS",
    20,
    y
  );

  y += 8;

  doc.line(
    20,
    y,
    190,
    y
  );

  y += 10;

  doc.setFontSize(12);

  doc.text(
    `Package: ${
      quotation.package_templates?.name
    }`,
    20,
    y
  );

  y += 8;

  doc.text(
    `Travelers: ${
      quotation.travelers
    }`,
    20,
    y
  );

  y += 25;

  // Price Box

  doc.setFillColor(
    240,
    249,
    255
  );

  doc.roundedRect(
    20,
    y,
    170,
    30,
    3,
    3,
    "F"
  );

  doc.setFontSize(12);

  doc.text(
    "TOTAL PACKAGE PRICE",
    75,
    y + 10
  );

  doc.setTextColor(
    16,
    185,
    129
  );

  doc.setFontSize(22);

  doc.text(
    `INR ${Number(
      finalPrice
    ).toLocaleString()}`,
    70,
    y + 23
  );

  doc.setTextColor(
    17,
    24,
    39
  );

  y += 50;

  // Notes

  doc.setFontSize(14);

  doc.text(
    "IMPORTANT NOTES",
    20,
    y
  );

  y += 8;

  doc.line(
    20,
    y,
    190,
    y
  );

  y += 10;

  doc.setFontSize(11);

  doc.text(
    "• Price subject to availability at confirmation.",
    20,
    y
  );

  y += 8;

  doc.text(
    "• Hotel allocation confirmed after booking.",
    20,
    y
  );

  y += 8;

  doc.text(
    "• Rates may vary during peak season.",
    20,
    y
  );

  y += 25;

  // Footer

  doc.setFillColor(
    6,
    182,
    212
  );

  doc.rect(
    0,
    270,
    210,
    27,
    "F"
  );

  doc.setTextColor(
    255,
    255,
    255
  );

  doc.setFontSize(11);

  doc.text(
    "Thank you for choosing Moksh Yatri",
    20,
    280
  );

  doc.text(
    "Contact: +91 95631 04446",
    20,
    288
  );

  doc.save(
    `quotation-${quotation.id}.pdf`
  );
}