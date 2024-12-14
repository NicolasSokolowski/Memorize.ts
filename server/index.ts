import { app } from "./src/index.app";

const PORT = process.env.PORT;

(async () => {
  app.listen(PORT, () => {
    console.info(`👂 Listening on port ${PORT}`);
  });
})();
