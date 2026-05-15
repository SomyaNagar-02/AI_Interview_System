import jwt from "jsonwebtoken";

export const generateVapiJwt = () => {
  return jwt.sign(
    {
      iss: "selectx-backend",
      sub: "selectx-ai-interview"
    },
    process.env.VAPI_API_KEY,
    {
      algorithm: "HS256",
      expiresIn: "5m"
    }
  );
};
