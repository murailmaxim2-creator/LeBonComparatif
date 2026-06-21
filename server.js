import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("."));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/recherche", async (req, res) => {
  try {
    const { produit } = req.body;

    const response = await openai.responses.create({
      model: "gpt-5.5",
      input: `
Tu es un expert en comparaison de produits.

Produit recherché :
${produit}

Donne :
- les 5 meilleurs produits
- avantages
- inconvénients
- lequel acheter
- rapport qualité prix

Réponds en HTML.
`
    });

    res.json({
      resultat: response.output_text
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      erreur: "Erreur IA"
    });
  }
});

app.get("/", (req, res) => {
    res.sendFile(process.cwd() + "/LeBonComparatif.html");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});