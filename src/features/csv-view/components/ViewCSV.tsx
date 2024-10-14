import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { useState } from "react";

function ViewCSV({ csvData }: { csvData: any[] }) {
  if (csvData.length === 0) {
    return <Box>No CSV file has been uploaded.</Box>;
  }

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // @ts-ignore
  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const headers = Object.keys(csvData[0]);
  const paginatedRows = csvData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  function downloadAsJSON() {
    const data = JSON.stringify(csvData, null, 2);

    const blob = new Blob([data], { type: "application/json" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "csv-as-json.json";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <Box>
      <TableContainer sx={{ width: "100%", height: "55vh" }}>
        <Table>
          <TableHead>
            <TableRow>
              {headers.map((header, index) => (
                <TableCell
                  key={index}
                  sx={{ maxWidth: 150, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {headers.map((header, index) => (
                  <TableCell
                    key={index}
                    sx={{ maxWidth: 150, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                  >
                    {row[header]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="space-between" sx={{ margin: 2 }}>
        <Box display="flex" flexDirection="column">
          <Button variant="outlined" sx={{ textTransform: "none" }} onClick={downloadAsJSON}>
            Download as JSON
          </Button>
        </Box>
        <TablePagination
          component="div"
          count={csvData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 25, 50, 100]}
        />
      </Box>
    </Box>
  );
}

export default ViewCSV;
