import * as cheerio from "cheerio";
import {
  BasicCompanyInfo,
  Company,
  Founder,
  JobData,
  BasicLaunchData,
  LaunchDetails,
  NewsData,
  CompanyData,
  LaunchData,
} from "./types";
import { CSV_INPUT_PATH, JSON_OUTPUT_PATH } from "./resources";
import { Browser, Page, chromium } from "playwright";
import { readCSVFile, writeJSONFile, getLinkedIn, hasOpenJobs } from "./helpers";

/**
 * Load HTML of webpage with chromium since YC website appears to be dynamically rendered with JavaScript
 *
 * Used chatGPT's code as a reference when creating this function
 *
 * @param url Url of webpage
 * @returns HTML string of webpage
 */
async function loadHTML(url: string): Promise<string> {
  // using chromium since YC website appears to be dynamically rendered with JavaScript
  // so I'm using a headless browser to render the page and get the HTML
  const browser: Browser = await chromium.launch({
    headless: true,
  });

  const page: Page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  const html: string = await page.content();
  await browser.close();
  return html;
}

/**
 * Scrapes the basic company information
 *
 * @param html HTML string of webpage
 * @returns Basic company information object
 */
function getBasicCompanyInformation(html: string): BasicCompanyInfo {
  const $ = cheerio.load(html);

  // get the children of the company card component on the page
  const companyCard: cheerio.Cheerio<cheerio.Element> = $("div.ycdc-card").children();

  const company: BasicCompanyInfo = {
    Name: "",
    Goal: "",
    Founded: "",
    "Team Size": "",
    Location: "",
    "Group Partner": "",
  };
  company["Name"] = $(companyCard[1]).text();
  company["Goal"] = $($($("section").children()[1]).find("div.prose")[1]).text();

  // get the company information from the card component and store it in the company object
  const companyInfo = $(companyCard[2]).children();
  companyInfo.each((index: number, element: cheerio.Element) => {
    const data: string[] = $(element).text().split(":");
    const key: keyof BasicCompanyInfo = data[0].trim() as keyof BasicCompanyInfo;
    company[key] = data[1].trim();
  });

  return company;
}

/**
 * Scrapes the founders of the company and their LinkedIn profiles
 *
 * @param html HTML string of webpage
 * @returns array of founders
 */
function getCompanyFounders(html: string): Founder[] {
  const $ = cheerio.load(html);
  const companyFounders: Founder[] = [];

  // first possibility of finding the founders
  let targetDiv: cheerio.Cheerio<cheerio.Element>;
  targetDiv = $("div").filter((i: number, el: cheerio.Element) => {
    return $(el).text() === "Active Founders";
  });

  // if there are founders, get their names and LinkedIn profiles
  if (targetDiv.length > 0) {
    const founders: cheerio.Cheerio<cheerio.Element> = targetDiv.next().children();
    founders.each((index: number, element: cheerio.Element) => {
      const founder: string = $(element).find("div.font-bold").text();
      const links: cheerio.Cheerio<cheerio.Element> = $(element).find("a");
      if (links.length > 0) {
        companyFounders.push({
          Name: founder,
          LinkedIn: getLinkedIn(html, links),
        });
      }
    });
  }

  // second possibility of finding the founders
  targetDiv = $("div").filter((i, el) => {
    return $(el).text() === "Founders";
  });

  // if there are founders, get their names and LinkedIn profiles
  if (targetDiv.length > 0) {
    const founders: cheerio.Cheerio<cheerio.Element> = targetDiv.next().children();
    founders.each((index: number, element: cheerio.Element) => {
      const founder: string = $(element).find("div.font-bold").text();
      const links: cheerio.Cheerio<cheerio.Element> = $(element).find("a");
      if (links.length > 0) {
        companyFounders.push({
          Name: founder,
          LinkedIn: getLinkedIn(html, links),
        });
      }
    });
  }

  return companyFounders;
}

/**
 * Scrape open job listings at the company
 *
 * @param html HTML string of webpage
 * @param companyName name of the company
 * @returns array of job listings
 */
function getOpenJobs(html: string, companyName: string): JobData[] {
  const $ = cheerio.load(html);
  const job: JobData[] = [];

  // get the element before the job listing section
  const target: cheerio.Cheerio<cheerio.Element> = $("h3").filter((i, el) => {
    return $(el).text().includes(`Jobs at ${companyName}`);
  });

  // get the job listings and store them in the job object
  const jobs: cheerio.Cheerio<cheerio.Element> = target.parent().next().children().children();
  jobs.each((index: number, element: cheerio.Element) => {
    const details: cheerio.Cheerio<cheerio.Element> = $(element).find("div.list-item");
    job.push({
      Title: $($(element).find("a")[0]).text(),
      Location: $(details[0]).text(),
      Salary: $(details[1]).text().includes("$") ? $(details[1]).text() : "",
      Experience: $(details[details.length - 1]).text(),
    });
  });

  return job;
}

/**
 * Scrape the basic company launches data
 *
 * @param html HTML string of webpage
 * @returns the company launches
 */
function getCompanyLaunches(html: string): BasicLaunchData[] {
  const $ = cheerio.load(html);
  const launches: BasicLaunchData[] = [];

  // get the element before the company launches section
  const target: cheerio.Cheerio<cheerio.Element> = $("h3").filter((i, el) => {
    return $(el).text().includes("Company Launches");
  });

  // get the company launches and store them in the launches object
  const BASE_URL: string = "https://www.ycombinator.com";
  const launchesList: cheerio.Cheerio<cheerio.Element> = target.parent().next();
  launchesList.each((index: number, element: cheerio.Element) => {
    launches.push({
      Title: $($(element).find("h3")[0]).text(),
      URL: BASE_URL + $($(element).find("a")).attr("href"),
    });
  });

  return launches;
}

/**
 * Scrape the launch details like author, tagline, date posted, and tags
 *
 * @param html HTML string of webpage
 * @returns Launch details
 */
function getLaunchDetails(html: string): LaunchDetails {
  const $ = cheerio.load(html);
  const tags: string[] = [];

  // get the tags from the launch post
  const hashtags = $("span").filter((i, el) => {
    return $(el).text()[0] === "#";
  });

  // store the tags in the tags array
  hashtags.each((index: number, element: cheerio.Element) => {
    tags.push($(element).text());
  });

  return {
    Tagline: $("p.tagline").text(),
    Author: $($("b")[1]).text(),
    "Date Posted": $("time").attr("datetime"),
    Tags: tags,
  };
}

/**
 * Scrape the news articles
 *
 * @param html HTML string of webpage
 * @returns News articles
 */
function getNews(html: string): NewsData[] {
  const $ = cheerio.load(html);
  const news: NewsData[] = [];

  // get the news articles from the webpage
  const newsList: cheerio.Cheerio<cheerio.Element> = $("h3")
    .filter((i: number, el: cheerio.Element) => {
      return $(el).text().includes("Latest News");
    })
    .parent()
    .next()
    .children();

  // store the news articles in the news object
  newsList.each((index: number, element: cheerio.Element) => {
    news.push({
      Title: $($(element).find("a")).text(),
      URL: $($(element).find("a")).attr("href"),
      Date: $(element).find("div.mb-4").text(),
    });
  });

  return news;
}

export async function processCompanyList() {
  try {
    // read the company data from the CSV file
    const companies: Company[] = await readCSVFile(CSV_INPUT_PATH);
    const companyData: CompanyData[] = [];

    // process each company
    for (const companyEntry of companies) {
      const html: string = await loadHTML(companyEntry["YC URL"]);

      // extract the company information
      const basicCompanyInfo: BasicCompanyInfo = getBasicCompanyInformation(html);
      const companyFounders: Founder[] = getCompanyFounders(html);

      // extract the company jobs
      const companyJobs: JobData[] = hasOpenJobs(html)
        ? getOpenJobs(await loadHTML(companyEntry["YC URL"] + "/jobs"), basicCompanyInfo["Name"])
        : [];

      // extract the company launches
      const launchPosts: LaunchData[] = [];
      const launches: BasicLaunchData[] = getCompanyLaunches(html);
      for (const launch of launches) {
        const launchHTML: string = await loadHTML(launch.URL);
        const launchDetails: LaunchDetails = getLaunchDetails(launchHTML);
        launchPosts.push({
          ...launch,
          ...launchDetails,
        });
      }

      // extract the news articles
      const news: NewsData[] = getNews(html);
      const company: CompanyData = {
        ...basicCompanyInfo,
        Founders: companyFounders,
        Jobs: companyJobs,
        "Launch Posts": launchPosts,
        News: news,
      };
      companyData.push(company);
    }

    // write the company data to the output JSON file
    await writeJSONFile(JSON_OUTPUT_PATH, companyData);
  } catch (error) {
    console.error(error);
  }
}
