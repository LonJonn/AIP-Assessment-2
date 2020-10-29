import mongoose from "mongoose";
import { NextHandler } from "next-connect";

const initDatabase = () =>
  mongoose
    .connect(process.env.MONGODB_URL!, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => {
      console.info("Connected to DB! 😊");
    });

/**
 * Middleware to establish a DB connection that can be called within getStaticProps/getServerSideProps
 * or including as next-connect middleware within a route handler.
 */
const withDatabase = async (req?, res?, next?: NextHandler) => {
  if (!mongoose.connection.readyState) await initDatabase();

  next?.();
};

export default withDatabase;
