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
      let pid = null;
      try {
        const parsed = new URL(url);
        pid = parsed.searchParams.get('pid');
      } catch (e) {
        pid = null;
      }

      if (!pid) {
        const m1 = url.match(/\/p\/(?:[^\/]+\/)?([^\/?#]+)/i);
        const m2 = url.match(/\/itm\/(?:[^\/]+\/)?([^\/?#]+)/i);
        pid = (m1 && m1[1]) || (m2 && m2[1]) || null;
      }

      if (!pid) {
        throw new Error('Could not determine Flipkart product id (pid) from URL');
      }

      return await scrapeFlipkartApi(pid);
   }
     throw new Error("Unsupported platform");
 }

