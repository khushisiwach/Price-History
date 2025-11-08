import axios from "axios";

export async function scrapeFlipkartApi(pid) {
  const url = `https://real-time-flipkart-data2.p.rapidapi.com/product-details?pincode=400001&pid=${pid}`;
  const options = {
    method: "GET",
    url,
    headers: {
      "x-rapidapi-host": "real-time-flipkart-data2.p.rapidapi.com",
      "x-rapidapi-key": process.env.RAPIDAPI_KEY,
    },
  };
   try{
  const response = await axios.request(options);
  const data = response.data.data;
    return {
      name: data.title || "",
      price: data.price || 0,
      image: data.images?.[0] || "",
    };
  } catch (error) {
    console.error("Flipkart API Error:", error.message);
    return { name: "", price: 0, image: "" };
  }
}
