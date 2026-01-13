// controller/AuthController.ts
import { Request, Response } from "express";
import { GenerateTokens, VerifyRefreshToken } from "./tokenHelper";

export const refreshAccessToken = (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res
      .status(400)
      .json({ status: false, message: "Refresh token required" });
  }

  const decoded = VerifyRefreshToken(refreshToken);

  if (!decoded) {
    return res
      .status(401)
      .json({ status: false, message: "Invalid or expired refresh token" });
  }

  const { token, refreshToken: newRefreshToken } = GenerateTokens(
    decoded.email,
    decoded.user_id,
    decoded.role
  );

  return res.status(200).json({
    status: true,
    message: "Access token refreshed successfully",
    token,
    refreshToken: newRefreshToken,
  });
};
