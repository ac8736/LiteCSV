import fs from "fs";
import config from "./knexfile";
import knex, { Knex } from "knex";
import { Organization } from "./types";
import { parse } from "fast-csv";

/**
 * Organization class to handle the organizations table
 */
export class OrganizationTable {
  private db: Knex;

  constructor() {
    this.db = knex(config.development);
  }

  /**
   * Create the organizations table if it does not exist
   *
   * @returns Promise<void>
   */
  async createTable(): Promise<void> {
    try {
      // Check if the organizations table exists
      const hasOrganizationsTable: boolean = await this.db.schema.hasTable("organizations");
      // Specifying the table columns
      if (!hasOrganizationsTable) {
        await this.db.schema.createTable("organizations", (table) => {
          table.increments("id").primary();
          table.integer("Index");
          table.string("Organization Id").notNullable();
          table.string("Name").notNullable();
          table.string("Website").notNullable();
          table.string("Country").notNullable();
          table.string("Description").notNullable();
          table.integer("Founded").notNullable();
          table.string("Industry").notNullable();
          table.integer("Number of employees").notNullable();
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Inserts organizations into the organizations table
   *
   * @param organizations array of organizations to insert
   * @returns Promise<void>
   */
  async insert(organizations: Organization[]): Promise<void> {
    if (organizations.length === 0) {
      return;
    }

    try {
      await this.db("organizations").insert(organizations);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Read and insert organizations from a CSV file
   *
   * @param csvFilePath path to CSV file
   * @returns
   */
  async readAndInsertFromCSV(csvFilePath: string): Promise<void> {
    const batchSize: number = 100;
    const rows: Organization[] = [];
    let insertInProgress: boolean = false; // Flag to check if an insert operation is in progress

    return new Promise((resolve, reject) => {
      const stream = fs
        .createReadStream(csvFilePath)
        .pipe(parse({ headers: true }))
        .on("data", async (row) => {
          // Parse CSV row and each row is added to the batch (rows array)
          rows.push({
            Index: parseInt(row.Index),
            "Organization Id": row["Organization Id"],
            Name: row.Name,
            Website: row.Website,
            Country: row.Country,
            Description: row.Description,
            Founded: parseInt(row.Founded),
            Industry: row.Industry,
            "Number of employees": parseInt(row["Number of employees"]),
          });

          // insert the batch of rows if the batch size is reached
          // and pause the stream to ensure insertion completes before reading more rows
          if (rows.length >= batchSize) {
            insertInProgress = true;
            stream.pause();
            await this.insert(rows);
            rows.length = 0;
            insertInProgress = false;
            stream.resume();
          }
        })
        .on("end", async () => {
          // Insert remaining rows if any
          if (rows.length > 0 && !insertInProgress) {
            await this.insert(rows);
          }
          resolve();
        })
        .on("error", (error: Error) => {
          console.error("Error reading CSV file:", error);
          reject(error);
        });
    });
  }

  /**
   * Destroys the database connection
   *
   * @returns Promise<void>
   */
  async destroy(): Promise<void> {
    try {
      await this.db.destroy();
    } catch (error) {
      console.error(error);
    }
  }
}
