import mongoose from 'mongoose'

const priceEntrySchema = new mongoose.Schema({
  price: { type: Number },
  date: { type: Date, default: () => new Date() },
})

const productSchema = new mongoose.Schema({
name:{type:String},
url:{type:String, required:true},
asin: { type: String },// Optional: for Amazon, store ASIN to identify product easily
image: {type:String},
currentPrice: {type:Number , required:true},
previousPrice: {type:Number, default:0},

priceHistory:[priceEntrySchema],  
user: {type:mongoose.Schema.Types.ObjectId , ref:"User"},
lastChecked:{type:Date ,default:Date.now()},
recommendation:{type:String , default:"Neutral"},
},{timestamps:true} );

productSchema.set("toJSON", {
  transform: function (doc, ret) {
    for (let key in ret) {
      if (ret[key] instanceof Date) {
        ret[key] = ret[key].toISOString();
      }
    }

    if (ret.priceHistory && Array.isArray(ret.priceHistory)) {
      ret.priceHistory = ret.priceHistory.map(ph => {
        const rawDate = ph.date || ph.Date || ph.createdAt || null;
        return {
          ...ph,
          date: rawDate ? new Date(rawDate).toISOString() : new Date().toISOString(),
        };
      });
    }
    return ret;
  },
});

export default mongoose.model("Product" , productSchema);
