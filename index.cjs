import express from "express";
const mysql = require("mysql2/promise");
const fs = require("fs");
const app = express();
app.use(express.json());

const dbConfig = {
  host: process.env.DB_HOST,
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    ca: fs.readFileSync("./ca.pem")
  }
};

app.post("/insert", async (req, res) => {
  const { pirkėjo_id, darbuotojo_id, paslaugos_id, val_kiekis } = req.body;

  try {
    const conn = await mysql.createConnection(dbConfig);
    await conn.query("CALL ĮrašytiPardavimąSuPaslauga(?, ?, ?, ?)", [
      pirkėjo_id,
      darbuotojo_id,
      paslaugos_id,
      val_kiekis
    ]);
    await conn.end();
    res.send({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, error: err.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});
