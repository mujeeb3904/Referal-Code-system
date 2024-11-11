const express = require("express");
const connectToMongoDB = require("./connection");
const router = require("./routes/route");

const app = express();
const port = 2000;

app.use(express.json());

connectToMongoDB(
  "mongodb+src://+++++++++:--------------++++++++++++-------MongoDB Address------+++++++++++------------+++++++++++--------++++++++++"
)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
  });

app.use("/api", router);

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
