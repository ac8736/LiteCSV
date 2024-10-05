import { Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { Column } from "../types";

interface ColumnTableProps {
  columns: Column[];
}

function ColumnTable({ columns }: ColumnTableProps) {
  return (
    <TableContainer component={Paper} sx={{ marginY: 5, maxHeight: "400px", overflow: "auto" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Column Name</TableCell>
            <TableCell>Data Type</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {columns.length > 0 ? (
            columns.map((column) => (
              <TableRow key={column.name}>
                <TableCell>{column.name}</TableCell>
                <TableCell>{column.type}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2}>No columns added yet.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ColumnTable;
