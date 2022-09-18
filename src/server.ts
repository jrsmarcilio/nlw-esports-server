import express from "express";

const app = express();

app.get("/users", (request, response) => {
  return response.status(200).json({ message: "hello wolrd" });
});

const PORT: number = 3333;
app.listen(PORT, () => console.log(`server running... PORT (${PORT})`));