import { Controller, Patch, Path, Route, Response, SuccessResponse, Tags } from "tsoa";
import * as repo from "../repositories/mission.repository";
import { ErrorResponse, SuccessResponse as SR } from "../types";

@Route("api/user-missions")
@Tags("Mission")
export class MissionController extends Controller {

  /**
   * 진행 중인 미션을 완료 처리합니다.
   */
  @Patch("{userMissionId}/complete")
  @SuccessResponse("200", "성공")
  @Response<ErrorResponse>(404, "존재하지 않는 미션입니다.")
  @Response<ErrorResponse>(409, "이미 완료된 미션입니다.")
  public async completeMission(
    @Path() userMissionId: number
  ): Promise<SR> {
    const result = await repo.completeMission(userMissionId);
    return { isSuccess: true, code: "2000", message: "성공", result };
  }
}