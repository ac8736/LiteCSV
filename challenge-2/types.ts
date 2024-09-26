export interface Company {
  "Company Name": string;
  "YC URL": string;
}

export interface BasicCompanyInfo {
  Name: string;
  Goal: string;
  Founded: string;
  "Team Size": string;
  Location: string;
  "Group Partner": string;
}

export interface Founder {
  Name: string;
  LinkedIn: string;
}

export interface JobData {
  Title: string;
  Location: string;
  Salary: string;
  Experience: string;
}

export interface BasicLaunchData {
  Title: string;
  URL: string;
}

export interface LaunchDetails {
  Tagline: string;
  Author: string;
  "Date Posted"?: string;
  Tags: string[];
}

export interface LaunchData extends BasicLaunchData, LaunchDetails {}

export interface NewsData {
  Title: string;
  URL?: string;
  Date: string;
}

export interface CompanyData {
  Name: string;
  Goal: string;
  Founded: string;
  "Team Size": string;
  Location: string;
  "Group Partner": string;
  Founders: Founder[];
  Jobs: JobData[];
  "Launch Posts": LaunchData[];
  News: NewsData[];
}
