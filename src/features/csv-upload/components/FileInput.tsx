import { Box } from "@mui/material";
import { CSVRow } from "@custom-types/csv-types";
import Papa from "papaparse";

function FileInput({
  setProcessing,
  setRows,
}: {
  setProcessing: (processing: boolean) => void;
  setRows: (rows: CSVRow[]) => void;
}) {
  function handleFileSubmit(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files ? event.target.files[0] : null;

    setProcessing(true);

    if (file) {
      const rowsToAdd: CSVRow[] = [];

      Papa.parse<CSVRow>(file, {
        chunk: (results) => {
          rowsToAdd.push(...results.data);
        },
        complete: () => {
          setRows(rowsToAdd);
          setProcessing(false);
        },
        header: true,
        skipEmptyLines: true,
      });
    }
  }

  return (
    <Box display="flex" alignItems="flex-start" paddingY={3}>
      <input type="file" accept=".csv" onChange={handleFileSubmit} />
    </Box>
  );
}

export default FileInput;
