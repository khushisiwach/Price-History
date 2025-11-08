import mongoose from 'mongoose'

const priceEntrySchema = new mongoose.Schema({
    price:{type:Number},
    Date: {type:Date ,default: () => new Date().toISOString().split('T')[0]},
})

const productSchema = new mongoose.Schema({
name:{type:String},
url:{type:String, required:true},
asin: { type: String },// Optional: for Amazon, store ASIN to identify product easily
image: {type:String},
currentPrice: {type:Number , required:true},
previousPrice: {type:Number, default:0},

priceHistory:[priceEntrySchema],  // Array to store historical prices over time
user: {type:mongoose.Schema.Types.ObjectId , ref:"User"},
lastChecked:{type:Date ,default:Date.now()},
recommendation:{type:String , default:"Neutral"},
// createdAt:{type:Date, default:Date.now()},
},{timestamps:true} );

// ✅ Global JSON transform (applies to all dates in this schema)
productSchema.set("toJSON", {
  transform: function (doc, ret) {
    for (let key in ret) {
      if (ret[key] instanceof Date) {
        // Format any direct date field
        ret[key] = ret[key].toISOString().split("T")[0];
      }
    }

    // For nested arrays like priceHistory
    if (ret.priceHistory && Array.isArray(ret.priceHistory)) {
      ret.priceHistory = ret.priceHistory.map(ph => ({
        ...ph,
        Date: new Date(ph.Date).toISOString().split("T")[0],
      }));
    }
    return ret;
    },
});

export default mongoose.model("Product" , productSchema);
