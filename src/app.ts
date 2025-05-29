import express from "express";
import connetDB from "./config/db.config";
import logger from "morgan";
const app = express();
const PORT: Number = process.env.PORT ? Number(process.env.PORT) : 5000;
app.use(express.json());
import routes from "./routes/index";
app.get("/", (req, res) => {
  res.send("Welcome to typescript backend!");
});
connetDB();
app.use("/", routes);
app.use(logger("dev"));
app.listen(PORT, () => {
  console.log(
    "The application is listening " + "on port http://localhost:" + PORT
  );
});
