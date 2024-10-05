// import fs from "fs";
// import config from "./knexfile";
// import knex, { Knex } from "knex";
// import { Customer } from "./types";
// import { parse } from "fast-csv";

// /**
//  * Customer class to handle the customers table
//  */
// export class CustomerTable {
//   private db: Knex;

//   constructor() {
//     this.db = knex(config.development);
//   }

//   /**
//    * Create the customers table if it does not exist
//    *
//    * @returns Promise<void>
//    */
//   async createTable(): Promise<void> {
//     try {
//       // Check if the customers table exists
//       const hasCustomersTable: boolean = await this.db.schema.hasTable("customers");

//       // Specifying the table columns
//       if (!hasCustomersTable) {
//         await this.db.schema.createTable("customers", (table) => {
//           table.increments("id").primary();
//           table.integer("Index");
//           table.string("Customer Id").notNullable();
//           table.string("First Name").notNullable();
//           table.string("Last Name").notNullable();
//           table.string("Company").notNullable();
//           table.string("City").notNullable();
//           table.string("Country").notNullable();
//           table.string("Phone 1").notNullable();
//           table.string("Phone 2").notNullable();
//           table.string("Email").notNullable();
//           table.dateTime("Subscription Date").notNullable();
//           table.string("Website").notNullable();
//         });
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   /**
//    * Inserts a batch of customers into the customers table
//    *
//    * @param customers array of customers to insert
//    * @returns Promise<void>
//    */
//   async insert(customers: Customer[]): Promise<void> {
//     // If there are no customers to insert, return to avoid empty query
//     if (customers.length === 0) {
//       return;
//     }

//     try {
//       // Insert the customers into the customers table
//       await this.db("customers").insert(customers);
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   /**
//    * Reads and inserts customers from a CSV file
//    *
//    * @param csvFilePath path to CSV file
//    * @returns Promise<void>
//    */
//   async readAndInsertFromCSV(csvFilePath: string): Promise<void> {
//     const batchSize: number = 100;
//     const rows: Customer[] = [];
//     let insertInProgress: boolean = false; // Flag to check if insertion is in progress

//     return new Promise((resolve, reject) => {
//       const stream = fs
//         .createReadStream(csvFilePath)
//         .pipe(parse({ headers: true }))
//         .on("data", async (row) => {
//           // Parse CSV row and each row is added to the batch (rows array)
//           rows.push({
//             Index: parseInt(row.Index),
//             "Customer Id": row["Customer Id"],
//             "First Name": row["First Name"],
//             "Last Name": row["Last Name"],
//             Company: row.Company,
//             City: row.City,
//             Country: row.Country,
//             "Phone 1": row["Phone 1"],
//             "Phone 2": row["Phone 2"],
//             Email: row.Email,
//             "Subscription Date": row["Subscription Date"],
//             Website: row.Website,
//           });

//           // insert the batch of rows if the batch size is reached
//           // and pause the stream to ensure insertion completes before reading more rows
//           if (rows.length >= batchSize) {
//             insertInProgress = true;
//             stream.pause();
//             await this.insert(rows);
//             rows.length = 0;
//             insertInProgress = false;
//             stream.resume();
//           }
//         })
//         .on("end", async () => {
//           // Insert remaining rows if any
//           if (rows.length > 0 && !insertInProgress) {
//             await this.insert(rows);
//           }
//           resolve();
//         })
//         .on("error", (error: Error) => {
//           console.error("Error reading CSV file:", error);
//           reject(error);
//         });
//     });
//   }

//   /**
//    * Destroys the database connection
//    *
//    * @returns Promise<void>
//    */
//   async destroy(): Promise<void> {
//     try {
//       await this.db.destroy();
//     } catch (error) {
//       console.error(error);
//     }
//   }
// }
