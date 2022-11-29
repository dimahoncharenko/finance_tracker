import { DataSource } from "typeorm";
import { config } from "dotenv";
config();

const connectDB = async () => {
  try {
    const client = await new DataSource({
      type: "postgres",
      host: "localhost",
      port: 5432,
      database: "postgres",
      entities: [],
      logging: false,
    });

    return client;
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
  }
};
