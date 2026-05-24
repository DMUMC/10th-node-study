import { Controller, Get, Path, Query, Route, Response, SuccessResponse, Tags } from "tsoa";
import * as repo from "../repositories/user.repository";
import { ErrorResponse, SuccessResponse as SR } from "../types";

@Route("api/users")
@Tags("User")
export class UserController extends Controller {

  /**
   * 내가 작성한 리뷰 목록을 조회합니다.
   */
  @Get("{userId}/reviews")
  @SuccessResponse("200", "성공")
  @Response<ErrorResponse>(404, "존재하지 않는 유저입니다.")
  public async getMyReviews(
    @Path() userId: number
  ): Promise<SR> {
    const result = await repo.getMyReviews(userId);
    return { isSuccess: true, code: "2000", message: "성공", result };
  }

  /**
   * 내가 진행 중인 미션 목록을 조회합니다.
   */
  @Get("{userId}/missions")
  @SuccessResponse("200", "성공")
  @Response<ErrorResponse>(404, "존재하지 않는 유저입니다.")
  public async getMyMissions(
    @Path() userId: number,
    @Query() status: "IN_PROGRESS" | "COMPLETED" = "IN_PROGRESS"
  ): Promise<SR> {
    const result = await repo.getMyMissions(userId, status);
    return { isSuccess: true, code: "2000", message: "성공", result };
  }
}