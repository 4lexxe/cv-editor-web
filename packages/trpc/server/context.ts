import * as mongo from "@cv/mongodb/models";
import { dbConnect } from "@cv/mongodb/dbConnect";
import { type inferAsyncReturnType } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import MobileDetect from "mobile-detect";
import requestIp from "request-ip";

import { mail } from "../modules/mail";
import { Telegram } from "../modules/telegram";

const telegram: Telegram = new Telegram(process.env.TELEGRAM_BOT!, process.env.TELEGRAM_CHAT!);

export const createContext = async ({ req, res }: CreateNextContextOptions) => {
  // Ensure MongoDB connection is established
  try {
    await dbConnect();
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }

  const ip = requestIp.getClientIp(req) || "127.0.0.1";

  const md = new MobileDetect(req.headers["user-agent"] || "");

  return {
    mongo,
    ip,
    md,
    mail,
    telegram,
    req,
    res,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
