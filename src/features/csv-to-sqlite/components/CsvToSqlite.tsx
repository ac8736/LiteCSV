import { useState } from "react";
import { Box, Button } from "@mui/material";
import { Column } from "../types";
import ColumnInput from "./ColumnInput";
import ColumnTable from "./ColumnTable";

function CsvToSqlite() {
  const [column, setColumn] = useState<Column>({ name: "", type: "" });
  const [columns, setColumns] = useState<Column[]>([]);

  function onInputChange(input: Column) {
    setColumn(input);
  }

  function addColumn() {
    setColumns([...columns, column]);
    setColumn({ name: "", type: "" });
  }

  return (
    <Box sx={{ width: 1 / 2, marginX: "auto" }}>
      <ColumnInput column={column} setColumn={onInputChange} />
      <Button variant="outlined" sx={{ marginTop: 3, width: "100%", paddingY: 2 }} onClick={addColumn}>
        Add Column
      </Button>
      <ColumnTable columns={columns} />
    </Box>
  );
}

export default CsvToSqlite;
