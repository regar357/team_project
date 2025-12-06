const express = require("express");
const path = require("path");
const foodRoutes = require("./routes/food");
const recipeRoutes = require("./routes/recipe");
const discardRoutes = require("./routes/discard");

const app = express();
const port = 3001;

app.use(express.static(path.join(__dirname, "../frontend/build")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/food", foodRoutes);
app.use("/recipe", recipeRoutes);
app.use("/discard", discardRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
