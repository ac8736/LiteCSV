import { CsvToSqlite } from "@features/csv-to-sqlite";
import { Box } from "@mui/material";

function Home() {
  return (
    <Box margin="auto">
      <CsvToSqlite />
    </Box>
  );
}

export default Home;
