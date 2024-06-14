const Report = ({ data }) => {
  const handleDownload = () => {
    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text("Scan Report", 14, 22);
    pdf.setFontSize(12);

    let yOffset = 30;

    Object.entries(data).forEach(([filePath, fileData], fileIndex) => {
      if (yOffset > 280) {
        pdf.addPage();
        yOffset = 20;
      }

      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 255);
      pdf.text(filePath, 14, yOffset);
      pdf.setTextColor(0);
      pdf.setFontSize(12);
      yOffset += 10;

      Object.entries(fileData).forEach(([key, values]) => {
        if (yOffset > 280) {
          pdf.addPage();
          yOffset = 20;
        }

        pdf.text(`${key.charAt(0).toUpperCase() + key.slice(1)}:`, 14, yOffset);
        yOffset += 7;

        values.forEach((item) => {
          if (yOffset > 280) {
            pdf.addPage();
            yOffset = 20;
          }

          pdf.setTextColor(255, 0, 0);
          pdf.text(`• ${item}`, 20, yOffset);
          pdf.setTextColor(0);
          yOffset += 7;
        });

        yOffset += 5;
      });

      yOffset += 10; // Add some space between file sections
    });

    pdf.save("report.pdf");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Scan Report</h1>
      <button
        onClick={handleDownload}
        className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
      >
        Download PDF
      </button>
      <div className="bg-white shadow-md rounded p-4">
        {Object.keys(data).map((filePath) => (
          <div key={filePath} className="mb-6">
            <h2 className="text-xl font-semibold text-blue-600">{filePath}</h2>
            <ul className="list-disc pl-5 mt-2">
              {Object.keys(data[filePath]).map((key) => (
                <li key={key} className="mb-2">
                  <span className="font-medium">
                    {key.charAt(0).toUpperCase() + key.slice(1)}:
                  </span>
                  <ul className="list-inside list-circle pl-5">
                    {data[filePath][key].map((item, index) => (
                      <li key={index} className="text-red-600">
                        {item}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Report;