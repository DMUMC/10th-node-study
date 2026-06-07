import { Body, Controller, Post, Route, SuccessResponse, Tags } from "tsoa";
import jwt from "jsonwebtoken";
import * as repo from "../repositories/auth.repository";
import { SuccessResponse as SR, ErrorResponse } from "../types";
import { Response } from "tsoa";

interface SignupBody {
  email: string;
  password: string;
  nickname: string;
}

interface LoginBody {
  email: string;
  password: string;
}

@Route("api/auth")
@Tags("Auth")
export class AuthController extends Controller {

  /** 회원가입 */
  @Post("signup")
  @SuccessResponse("201", "회원가입 성공")
  @Response<ErrorResponse>(409, "이미 존재하는 이메일입니다.")
  public async signup(@Body() body: SignupBody): Promise<SR> {
    const result = await repo.createUser(body.email, body.password, body.nickname);
    this.setStatus(201);
    return { isSuccess: true, code: "2010", message: "회원가입 성공", result };
  }

  /** 로그인 */
  @Post("login")
  @SuccessResponse("200", "로그인 성공")
  @Response<ErrorResponse>(401, "비밀번호가 일치하지 않습니다.")
  @Response<ErrorResponse>(404, "존재하지 않는 유저입니다.")
  public async login(@Body() body: LoginBody): Promise<SR> {
    const user = await repo.loginUser(body.email, body.password);
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });
    return { isSuccess: true, code: "2000", message: "로그인 성공", result: { token } };
  }
}