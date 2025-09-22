import mongoose from "mongoose";

async function connection() {
  await mongoose
    .connect(process.env.DB_CONNECTION)
    .then(() => {
      console.log("logged to database");
    })
    .catch((err) => {
      console.log("este erro: " + err);
    });
}

export default connection;
