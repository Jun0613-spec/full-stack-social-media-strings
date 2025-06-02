import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

import { prisma } from "../lib/prisma";

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.SERVER_URL}/api/auth/callback/google`
);

export const getGoogleAUthURL = (req: Request, res: Response): void => {
  const scopes = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email"
  ];

  const authUrl = client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes
  });

  res.json({ url: authUrl });
};

export const googleCallback = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { code } = req.query;

  if (!code || typeof code !== "string") {
    res.status(400).json({ message: "Authorization code is required" });
    return;
  }

  try {
    // Exchange authorization code for tokens
    const { tokens } = await client.getToken(code);

    // Verify the ID token
    client.setCredentials(tokens);
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token as string,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      res.status(400).json({ message: "Invalid Google credentials" });
      return;
    }

    let user = await prisma.user.findUnique({
      where: { email: payload.email }
    });

    if (!user) {
      const baseUsername = (
        payload.given_name || payload.email.split("@")[0]
      ).toLowerCase();

      const uniqueUsername = `${baseUsername}_${Math.floor(
        Math.random() * 10000
      )}`;

      user = await prisma.user.create({
        data: {
          email: payload.email,
          firstName: payload.given_name || "",
          lastName: payload.family_name || "",
          username: uniqueUsername,
          password: "",
          googleId: payload.sub,
          avatarImage: payload.picture || null
        }
      });
    } else if (!user.googleId) {
      user = await prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          googleId: payload.sub
        }
      });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "1d" }
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    });

    res.redirect(
      `${process.env.CLIENT_URL!}/auth/google/success?token=${token}&userId=${
        user.id
      }&username=${encodeURIComponent(user.username)}`
    );
  } catch (error) {
    console.error("Google Authentication Error:", error);
    res.status(500).json({ message: "Failed to authenticate with Google" });
  }
};
