const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { DB_URI, PORT } = require("./src/config/env");
const userRoutes = require("./src/routes/user.routes");
const resourceRoutes = require("./src/routes/resource.routes");
const tagsRoutes = require("./src/routes/tags.routes");
const { validateUser } = require("./src/middlewares/user");

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(validateUser);

// routes
app.use("/users", userRoutes);
app.use("/resources", resourceRoutes);
app.use("/tags", tagsRoutes);

// connect to mongodb
mongoose
  .connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

// listen to port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
