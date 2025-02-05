import { server } from "./app.js";
import appconfig from "./config/appConfig.js";
import connectdb from "./database/dbconnect.js";

(async () => {
  try {
    await connectdb();

    server.listen(appconfig.PORT, () => {
      console.log(
        `Server started at http://localhost:${appconfig.PORT || 3030}/`
      );
    });
  } catch (error) {
    console.error("Server initialization error:", error);
    process.exit(1);
  }
})();