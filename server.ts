import path from "path";
import express from "express";
require("dotenv").config();
import cors from "cors";
import * as routes from "./routes";
import session from "express-session";

const port = process.env.PORT || 4000;
const app = express();

let origin = '';
if (process.env.NODE_ENV === "production") {
  origin = "https://fishily.netlify.app";
} else {
  origin = "http://localhost:3000";
}
const corsOptions = {
  origin: origin,
};

app.use(express.json());
app.use(cors(corsOptions));

//EXPRESS SESSION
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 * 2,
    },
    
  })
);

//API ROUTES
app.use("/api/fishily/users", routes.users);
app.use("/api/fishily/posts", routes.posts);
app.use("/api/fishily/comments", routes.comments);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("fishily-client/build"));
  app.get("*", (res: { sendFile: (arg0: any) => void; }) => {
    res.sendFile(
      path.resolve(__dirname, "fishily-client", "build", "index.html")
    );
  });
}

//conection
app.listen(port, () => console.log(`Server is running on port: ${port}`));
