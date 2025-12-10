import axios from "axios";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const app = express();
app.use(express.json());

let accessToken = null;
let refreshToken = null;

// --- 1. Redirect do autoryzacji użytkownika ---
app.get("/auth", (req, res) => {
  const authUrl = `https://allegro.pl/auth/oauth/authorize?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&scope=${encodeURIComponent(process.env.SCOPE)}`;
  res.redirect(authUrl);
});

// --- 2. Callback po autoryzacji ---
app.get("/callback", async (req, res) => {
  const code = req.query.code;

  if (!code) return res.status(400).send("Brak kodu autoryzacji");

  try {
    const params = new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: process.env.REDIRECT_URI,
    });

    const auth = Buffer.from(
      `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`,
    ).toString("base64");

    const tokenRes = await axios.post(
      "https://allegro.pl/auth/oauth/token",
      params.toString(),
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    accessToken = tokenRes.data.access_token;
    refreshToken = tokenRes.data.refresh_token;

    res.send(
      "✔ Autoryzacja zakończona sukcesem. Token pobrany. Możesz teraz użyć /delivery-methods",
    );
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send("Błąd przy pobieraniu tokenu");
  }
});

// --- 3. Funkcja odświeżania tokenu ---
async function refreshAccessToken() {
  const params = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const auth = Buffer.from(
    `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`,
  ).toString("base64");

  const tokenRes = await axios.post(
    "https://allegro.pl/auth/oauth/token",
    params.toString(),
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  accessToken = tokenRes.data.access_token;
  refreshToken = tokenRes.data.refresh_token;
  console.log("✔ Token odświeżony");
}

// --- 4. Endpoint pobierający metody dostawy ---
app.get("/delivery-methods", async (req, res) => {
  try {
    if (!accessToken)
      return res.status(401).send("Brak tokenu. Zaloguj się przez /auth");

    try {
      const deliveryRes = await axios.get(
        "https://api.allegro.pl/sale/delivery-methods",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.allegro.public.v1+json",
          },
        },
      );

      res.json(deliveryRes.data);
    } catch (err) {
      // Jeśli token wygasł → odśwież i spróbuj ponownie
      if (err.response?.status === 401) {
        await refreshAccessToken();
        const deliveryResRetry = await axios.get(
          "https://api.allegro.pl/sale/delivery-methods",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/vnd.allegro.public.v1+json",
            },
          },
        );
        return res.json(deliveryResRetry.data);
      }
      throw err;
    }
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send("Błąd pobierania metod dostawy");
  }
});

// --- 5. Start serwera ---
app.listen(3002, () => {
  console.log(`🚀 Serwer działa na http://localhost:${3002}`);
  console.log("Wejdź na /auth aby rozpocząć autoryzację Allegro");
});
