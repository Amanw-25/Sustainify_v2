import { server, io } from "./app.js";
import connectdb from "./database/dbconnect.js";
import appconfig from "./config/appConfig.js";
import SocketManager from "./socket.js";

(async () => {
  try {
    await connectdb();

    new SocketManager(io);

    server.listen(appconfig.PORT, () => {
      console.log(
        `Server started at http://localhost:${appconfig.PORT || 3030}/`
      );
      console.log(
        `WebSocket running at ws://localhost:${appconfig.PORT || 3030}/`
      );
    });
  } catch (error) {
    console.error(" Server initialization error:", error);
    process.exit(1);
  }
})();
