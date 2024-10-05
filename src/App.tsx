import "./App.css";
import Home from "./pages/Home";
// import { useState } from "react";
// import Papa from "papaparse";

// interface Column {
//   name: string;
//   type: string;
// }

function App() {
  // const [fileData, setFileData] = useState<any[]>([]);
  // const [fileName, setFileName] = useState("");
  // const [columns, setColumns] = useState<Column[]>([]);
  // const [columnName, setColumnName] = useState("");

  // function handleFileSubmit(event: React.ChangeEvent<HTMLInputElement>) {
  //   const file = event.target.files ? event.target.files[0] : null;
  //   if (file) {
  //     setFileName(file.name);

  //     Papa.parse(file, {
  //       complete: function (results) {
  //         setFileData(results.data); // Parsed data
  //         console.log(results.data); // Log CSV data to see it in console
  //       },
  //       header: true, // If your CSV has a header row, set this to true
  //       skipEmptyLines: true, // Skip empty lines in the CSV
  //     });
  //   }
  // }

  return (
    <>
      <Home />
      {/* <h2>CSV Uploader</h2>
      <input type="file" accept=".csv" onChange={handleFileSubmit} />
      {fileName && <p>Uploaded File: {fileName}</p>}
      {fileData && (
        <div>
          <h3>CSV Data:</h3>
          <pre>{JSON.stringify(fileData, null, 2)}</pre>
        </div>
      )}
      <table>
        <tbody>
          {columns.map((column: Column, index: number) => (
            <tr key={index}>
              <td>
                {column.name}
                {column.type}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <input type="text" placeholder="Column Name" value={columnName} onChange={(e) => setColumnName(e.target.value)} />
      <button onClick={() => setColumns([...columns, { name: columnName, type: "String" }])}>Add Column</button> */}
    </>
  );
}

export default App;
