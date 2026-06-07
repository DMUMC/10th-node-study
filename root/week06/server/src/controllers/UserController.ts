import { Body, Controller, Get, Patch, Query, Request, Route, Security, SuccessResponse, Tags } from "tsoa";
import { Request as ExRequest } from "express";
import * as userRepo from "../repositories/user.repository";
import * as authRepo from "../repositories/auth.repository";
import { SuccessResponse as SR, ErrorResponse } from "../types";
import { Response } from "tsoa";

interface UpdateUserBody {
  nickname?: string;
  phone?: string;
  /** YYYY-MM-DD 형식 */
  birthday?: string;
}

@Route("api/users")
@Tags("User")
export class UserController extends Controller {

  /** 내가 작성한 리뷰 목록 */
  @Get("me/reviews")
  @SuccessResponse("200", "성공")
  @Response<ErrorResponse>(401, "로그인이 필요합니다.")
  public async getMyReviews(@Request() request: ExRequest): Promise<SR> {
    const userId = (request as any).user.id;
    const result = await userRepo.getMyReviews(userId);
    return { isSuccess: true, code: "2000", message: "성공", result };
  }

  /** 내가 진행 중인 미션 목록 */
  @Get("me/missions")
  @SuccessResponse("200", "성공")
  @Response<ErrorResponse>(401, "로그인이 필요합니다.")
  public async getMyMissions(
    @Request() request: ExRequest,
    @Query() status: "IN_PROGRESS" | "COMPLETED" = "IN_PROGRESS"
  ): Promise<SR> {
    const userId = (request as any).user.id;
    const result = await userRepo.getMyMissions(userId, status);
    return { isSuccess: true, code: "2000", message: "성공", result };
  }

  /** 내 정보 수정 */
  @Patch("me")
  @SuccessResponse("200", "성공")
  @Response<ErrorResponse>(401, "로그인이 필요합니다.")
  public async updateMe(
    @Request() request: ExRequest,
    @Body() body: UpdateUserBody
  ): Promise<SR> {
    const userId = (request as any).user.id;
    const result = await authRepo.updateUser(userId, body);
    return { isSuccess: true, code: "2000", message: "성공", result };
  }
}