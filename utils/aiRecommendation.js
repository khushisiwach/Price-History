export  function getRecommendation(priceHistory , currentPrice){
    if(!priceHistory || priceHistory.length === 0) return "Neutral"

   const prices = priceHistory.map(p => p.price).filter( p => p > 0)
   if(prices.length === 0) return "Neutral";

  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
   const lastPrice = prices[prices.length -1];
   const recentDrop = lastPrice > currentPrice;

   if(currentPrice < avgPrice || recentDrop) return "Strong Buy";
   if(currentPrice < avgPrice) return "Buy";
   if(currentPrice > avgPrice) return "wait";
     return "Neutral";
}