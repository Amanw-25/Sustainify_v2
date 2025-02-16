import { app } from "./app.js";
import connectdb from "./database/dbconnect.js";
import appconfig from "./config/appConfig.js";

(async () => {
  try {
    await connectdb();

    app.listen(appconfig.PORT, () => {
      console.log(
        `Server started at http://localhost:${appconfig.PORT || 3030}/`
      );
    });
  } catch (error) {
    console.error(" Server initialization error:", error);
    process.exit(1);
  }
})();
