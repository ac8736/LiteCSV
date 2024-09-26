/**
 * The entry point function. This will download the given dump file, extract/decompress it,
 * parse the CSVs within, and add the data to a SQLite database.
 * This is the core function you'll need to edit, though you're encouraged to make helper
 * functions!
 */

import fs from "fs";
import https from "https";
import path from "path";
import tar from "tar";
import zlib from "zlib";
import { WriteStream } from "fs";
import { pipeline } from "stream/promises";
import { fileURLToPath } from "url";
import { IncomingMessage } from "http";
import { DUMP_DOWNLOAD_URL } from "./resources";
import { CustomerTable } from "./customer";
import { OrganizationTable } from "./organization";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Download dump file from given URL and save it to the destination path
 *
 * Function written with assist from chatGPT
 *
 * @param url url to download the dump file
 * @param destination destination path to save the dump file
 * @returns true if the file is downloaded successfully, false otherwise
 */
async function downloadDumpFile(url: string, destination: string): Promise<boolean> {
  // ensure destination directory exists
  if (fs.existsSync(destination)) {
    return true;
  }

  return new Promise<boolean>((resolve, reject) => {
    const file: WriteStream = fs.createWriteStream(destination);

    // download the file
    https
      .get(url, (response: IncomingMessage) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download file: ${url}`));
        }

        response.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve(true);
        });
      })
      .on("error", (err: Error) => {
        fs.unlink(destination, () => reject(err));
      });
  });
}

/**
 * Extract a tar.gz file to the destination directory
 *
 * @param file path to the tar.gz file
 * @param destination destination directory to extract the file
 */
async function extractDumpFile(file: string, destination: string): Promise<void> {
  return pipeline(
    fs.createReadStream(file),
    zlib.createGunzip(),
    tar.extract({
      cwd: destination,
    })
  );
}

export async function processDataDump() {
  // create a temporary directory to store the dump file
  const tempDir: string = path.join(__dirname, "tmp");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  // download and extract the dump file
  const dumpFileName = "dump.tar.gz";
  const downloadPath: string = path.join(tempDir, dumpFileName);
  const success: boolean = await downloadDumpFile(DUMP_DOWNLOAD_URL, downloadPath);
  if (!success) {
    console.error("Failed to download the dump file.");
    return;
  }
  await extractDumpFile(downloadPath, tempDir);

  // create a directory to store the database file
  const outDir: string = path.join(__dirname, "out");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
  }

  const customerCSVPath: string = path.join(tempDir, "/dump/customers.csv");

  // create and insert data into the customer table
  const customerTable: CustomerTable = new CustomerTable();
  await customerTable.createTable();
  await customerTable.readAndInsertFromCSV(customerCSVPath);
  await customerTable.destroy();

  const organizationCSVPath: string = path.join(tempDir, "/dump/organizations.csv");

  // create and insert data into the organization table
  const organizationTable: OrganizationTable = new OrganizationTable();
  await organizationTable.createTable();
  await organizationTable.readAndInsertFromCSV(organizationCSVPath);
  await organizationTable.destroy();
}
