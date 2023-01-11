import PdfPrinter from "pdfmake";

export const getPDFReadableStream = (post) => {
  const fonts = {
    Roboto: {
      normal: "Helvetica",
    },
  };

  const printer = new PdfPrinter(fonts);

  const docDefinition = {
    content: [
      { text: [post.title, post.author.name], bold: true, alignment: "center" },
      { text: [post.content], alignment: "center" },
    ],
  };

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition);
  pdfReadableStream.end();

  return pdfReadableStream;
};
