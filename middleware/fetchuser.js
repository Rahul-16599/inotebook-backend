const jwt = require("jsonwebtoken");
const JWT_SECRET = "rhaulisgood$boy";

const fetchuser= (req, res, next) => {
  // get the user from the JWT token and append id to request object
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({error: "Pleasd authenticate with valid token"});
  }
  try {
    const data = jwt.verify(token, "JWT_SECRET");
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({error: "user data cannot be access"});
  }
};

module.exports = fetchuser;
