import { Box, FormControl, InputLabel, MenuItem, OutlinedInput, Select, Typography } from "@mui/material";
import { Column } from "../types";

interface ColumnInputProps {
  column: Column;
  setColumn: (column: Column) => void;
}

function ColumnInput({ column, setColumn }: ColumnInputProps) {
  const SQLITE_DATA_TYPES = ["Undefined", "Integer", "Real", "Text", "Blob"];

  return (
    <Box>
      <Typography paddingBottom={2} textAlign="left" sx={{ width: "fit-content" }}>
        Please add your CSV columns and their respective data types.
      </Typography>
      <Box sx={{ display: "flex" }}>
        <FormControl sx={{ flexGrow: 1, marginRight: 1 }}>
          <InputLabel htmlFor="outlined-adornment-amount">Column Name</InputLabel>
          <OutlinedInput
            id="outlined-adornment-amount"
            label="Column Name"
            value={column.name}
            onChange={(e) => setColumn({ ...column, name: e.target.value })}
          />
        </FormControl>
        <FormControl sx={{ width: 1 / 4, marginLeft: 1 }}>
          <InputLabel id="demo-simple-select-label">Data Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={column.type}
            label="Data Type"
            onChange={(e) => setColumn({ ...column, type: e.target.value as string })}
          >
            {SQLITE_DATA_TYPES.map((dataType) => (
              <MenuItem key={dataType} value={dataType}>
                {dataType}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}

export default ColumnInput;
