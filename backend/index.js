import express from "express";
import cors from "cors";
import multer from "multer";
import { stegoEmbed, stegoExtract } from "./stego.js";

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
  })
);
app.use(express.json());

app.post(
  "/api/stego/embed",
  upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "secret", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const coverBuf = req.files["cover"][0].buffer;
      const secretBuf = req.files["secret"][0].buffer;

      const stegoBase64 = await stegoEmbed(coverBuf, secretBuf);
      res.json({ stego: stegoBase64 });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
);

app.post(
  "/api/stego/extract",
  upload.fields([{ name: "stego" }, { name: "cover" }]),
  async (req, res) => {
    try {
      const stego = req.files["stego"][0].buffer;
      const cover = req.files["cover"][0].buffer;
      const secretImg = await stegoExtract(stego, cover);
      res.json({ success: true, secret: secretImg });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
