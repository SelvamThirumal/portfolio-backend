import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route
app.post("/send", async (req, res) => {
  const { name, email, message } = req.body;

  // ✅ Validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sender: {
          name: "Selvam Portfolio",
          email: "selvamthirumal22@gmail.com" // ✅ MUST be verified in Brevo
        },
        to: [
          {
            email: "selvamthirumal22@gmail.com"
          }
        ],
        subject: `New Message from ${name}`,
        htmlContent: `
          <h2>New Portfolio Message</h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Message:</b> ${message}</p>
        `
      })
    });

    const data = await response.json();

    // 🔍 Debug log
    console.log("BREVO RESPONSE:", data);

    if (response.ok) {
      return res.status(200).json({
        success: true,
        message: "Email sent successfully"
      });
    } else {
      return res.status(400).json({
        success: false,
        error: data
      });
    }

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});

// Start server
app.listen(5000, () => {
  console.log("🚀 Server running at http://localhost:5000");
});