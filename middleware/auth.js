import jwt from "jsonwebtoken";
const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if(!authHeader){
    return res.status(401).json({ msg: "No token, authorization denied" });
    }
    const token = authHeader.replace("Bearer ", "");
    try{
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
       req.user =  { _id: decoded.id };
       next();
    } catch(error){
         res.status(401).json({ msg: "Token is not valid" });
    }
}
export default authMiddleware;