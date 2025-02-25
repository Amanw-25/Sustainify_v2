import { app } from "./app.js";
import connectdb from "./database/dbconnect.js";
import appconfig from "./config/appConfig.js";

(async () => {
  try {
    await connectdb();

    app.listen(appconfig.PORT, () => {
      console.log(
        `Server started at https://sustainify-v2.onrender.com/`
      );
    });
  } catch (error) {
    console.error(" Server initialization error:", error);
    process.exit(1);
  }
})();
