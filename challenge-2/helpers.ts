import fs, { mkdir, writeFile } from "fs";
import { Company } from "./types";
import { parseString } from "fast-csv";
import * as cheerio from "cheerio";

/**
 * Read CSV file and return array of Company objects
 *
 * @param filePath path to CSV file
 * @returns array of Company objects
 */
export async function readCSVFile(filePath: string): Promise<Company[]> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      // parse CSV file and record each row as a Company object
      const rows: Company[] = [];
      parseString(data, { headers: true })
        .on("data", (row: Company) => {
          rows.push({
            "Company Name": row["Company Name"],
            "YC URL": row["YC URL"],
          });
        })
        .on("end", () => {
          resolve(rows);
        })
        .on("error", (error: Error) => {
          reject(error);
        });
    });
  });
}

/**
 * Writes and saves the JSON object to a file
 *
 * @param filePath path to store JSON file
 * @param data JSON object to write
 * @returns void
 */
export async function writeJSONFile(filePath: string, data: any): Promise<void> {
  return new Promise((resolve, reject) => {
    const dirPath: string = filePath.substring(0, filePath.lastIndexOf("/"));

    // create directory if it doesn't exist
    mkdir(dirPath, { recursive: true }, (err) => {
      if (err) {
        console.error("Error creating directory:", err);
        reject(err);
      }

      // write JSON object to file
      writeFile(filePath, JSON.stringify(data), "utf8", (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
}

/**
 * Get LinkedIn profile URL of the founder
 *
 * @param html HTML string of webpage
 * @param links Cheerio element of links found on webpage
 * @returns the founder's LinkedIn profile URL
 */
export function getLinkedIn(html: string, links: cheerio.Cheerio<cheerio.Element>): string {
  const $ = cheerio.load(html);

  // Filter out all links that are not LinkedIn profile
  const linkedInLink: cheerio.Cheerio<cheerio.Element> = $(links).filter(
    (i: number, el: cheerio.Element) => {
      return el.attribs.title === "LinkedIn profile";
    }
  );

  // Return empty string if no LinkedIn profile found
  if (linkedInLink.length === 0) {
    return "";
  }

  return linkedInLink[0].attribs.href;
}

/**
 * Check if there are open jobs at the company
 *
 * @param html HTML string of webpage
 * @returns whether the company has open jobs
 */
export function hasOpenJobs(html: string): boolean {
  const $ = cheerio.load(html);

  // get the number of open jobs
  const target: cheerio.Cheerio<cheerio.Element> = $("a").filter((i, el) => {
    return $(el).text() === "Jobs";
  });

  // return true if there are open jobs
  const jobs: number = parseInt(target.next().text());
  return jobs > 0;
}
