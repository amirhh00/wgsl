import bcrypt from "bcryptjs";

export const saltAndHashPassword = async (password: string): Promise<string> => {
  if (!process.env.SALT) {
    throw new Error("Salt is not defined in the environment variables.");
  }

  return await bcrypt.hash(password, process.env.SALT);
};
