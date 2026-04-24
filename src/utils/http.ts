import type { Response } from "express";

export function badRequest(res: Response, message: string): Response {
  return res.status(400).json({ error: message });
}

export function forbidden(res: Response, message = "Forbidden"): Response {
  return res.status(403).json({ error: message });
}

export function notFound(res: Response, message = "Not found"): Response {
  return res.status(404).json({ error: message });
}
