// import { CsvToSqlite } from "@features/csv-to-sqlite";
import { useState } from "react";
import { ViewCSV } from "@features/csv-view";
import { Box, Typography, Tabs, Tab, Backdrop, CircularProgress } from "@mui/material";
import { CSVRow } from "@custom-types/csv-types";
import { FileInput } from "@features/csv-upload";
import { CustomTabPanel } from "@components/Tabs";

function Home() {
  const [currentTab, setCurrentTab] = useState(0);
  const [processing, setProcessing] = useState(false);

  const [rows, setRows] = useState<CSVRow[]>([]);

  // @ts-ignore
  const handleTabSwitch = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Box margin="auto">
      <Typography variant="h2" component="h1" textAlign="left">
        LiteCSV
      </Typography>
      <Typography textAlign="left">
        An all-in-one place to deal with CSV files. Simply upload your CSV file to use the available tools.
      </Typography>

      <FileInput setProcessing={(isProcessing) => setProcessing(isProcessing)} setRows={(rows) => setRows(rows)} />

      <Tabs value={currentTab} onChange={handleTabSwitch}>
        <Tab label="View CSV" />
        <Tab label="Convert CSV file to SQLite" />
      </Tabs>
      <CustomTabPanel value={currentTab} index={0}>
        <ViewCSV csvData={rows} />
      </CustomTabPanel>

      <Backdrop sx={{ color: "#fff" }} open={processing}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <CircularProgress color="inherit" />
          <Typography padding={2}>Processing CSV file...</Typography>
        </Box>
      </Backdrop>
    </Box>
  );
}

export default Home;
