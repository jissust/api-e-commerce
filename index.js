import express from "express";
import cors from "cors";
import { MercadoPagoConfig, Preference } from "mercadopago";
import "dotenv/config";

const client = new MercadoPagoConfig({
  accessToken:process.env.MERCADOPAGO_ACCESS_TOKEN,
});

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("soy el server");
});

app.post("/create_preference", async (req, res) => {

  try {
    const { products } = req.body;

    const items = products.map((product) => ({
      title: product.title,
      quantity: 1,
      unit_price: Number(product.price),
      currency_id: product.currency_id || "ARS",
    }));

    const body = {
      items,
      back_urls: {
        success: "/",
        failure: "/",
        pending: "/",
      },
      auto_return: "approved",
    };

    const preference = new Preference(client);
    const result = await preference.create({ body });

    res.json({
      id: result.id,
    });
  } catch (error) {
    res.status(500).json({
      error: error
    });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
