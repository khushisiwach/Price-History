import { scrapeFlipkartApi } from "./flipkartScraper.js";
import { amazonScrapeProduct } from "./amazonScraper.js";


export  function getPlatform(url) {
   if (url.includes("amazon.in")) return "amazon";
   if (url.includes("flipkart.com")) return "flipkart";
   throw new Error("Unsupported platform");
 }

 export async function scrapeProduct(url){
   const platform =  getPlatform(url);
   if(platform == "amazon"){
    return await amazonScrapeProduct(url);
   }
   
   if(platform == "flipkart"){
       const pid= new URL(url).searchParams.get("pid");
    return await scrapeFlipkartApi(pid);
   }
     throw new Error("Unsupported platform");
 }

