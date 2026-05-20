import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "./routes";
import { AppError } from "./errors";

const app = express();

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI
const swaggerDocument = require("../public/swagger.json");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// TSOA 자동 생성 라우트 등록
RegisterRoutes(app);

// 에러 핸들러
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      isSuccess: false,
      code: err.code,
      message: err.message,
    });
  } else {
    console.error(err);
    res.status(500).json({
      isSuccess: false,
      code: "5000",
      message: "서버 에러가 발생했습니다.",
    });
  }
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));