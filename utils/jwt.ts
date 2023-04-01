import jwt from "jsonwebtoken";

export const signToken = (_id: string, email: string) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined");

  return jwt.sign(
    // Payload
    { _id, email },

    // Secret
    process.env.JWT_SECRET,

    // Options
    { expiresIn: "1d" }
  );
};

//Validate token
export const isValidToken = (token: string): Promise<string> => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  if (token.length < 10) {
    return Promise.reject("Invalid token");
  }

  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, process.env.JWT_SECRET || "", (err, payload) => {
        if (err) return reject(err);

        const { _id } = payload as { _id: string };
        resolve(_id);
      });
    } catch (error) {
      reject("El token no es valido");
    }
  });
};
