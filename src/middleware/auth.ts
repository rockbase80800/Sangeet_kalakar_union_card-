import type { NextFunction, Request, Response } from "express";
import type { Role } from "../domain/types.js";

declare global {
  namespace Express {
    interface Request {
      actor?: {
        userId: string;
        role: Role;
      };
    }
  }
}

export function mockAuth(req: Request, _res: Response, next: NextFunction): void {
  const userId = req.header("x-user-id") || "";
  const role = (req.header("x-role") || "customer") as Role;

  req.actor = { userId, role };
  next();
}

export function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.actor || !roles.includes(req.actor.role)) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    next();
  };
}
