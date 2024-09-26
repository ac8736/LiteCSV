/**
 * Defining interfaces for the data in the CSV files
 */

export interface Customer {
  Index: number;
  "Customer Id": string;
  "First Name": string;
  "Last Name": string;
  Company: string;
  City: string;
  Country: string;
  "Phone 1": string;
  "Phone 2": string;
  Email: string;
  "Subscription Date": string;
  Website: string;
}

export interface Organization {
  Index: number;
  "Organization Id": string;
  Name: string;
  Website: string;
  Country: string;
  Description: string;
  Founded: number;
  Industry: string;
  "Number of employees": number;
}
