import { Controller, Patch, Path, Request, Route, Security, SuccessResponse, Tags } from "tsoa";
import { Request as ExRequest } from "express";
import * as repo from "../repositories/mission.repository";
import { SuccessResponse as SR, ErrorResponse } from "../types";
import { Response } from "tsoa";

@Route("api/user-missions")
@Tags("Mission")
export class MissionController extends Controller {

  /** 진행 중인 미션을 완료 처리합니다. */
  @Patch("{userMissionId}/complete")
  @SuccessResponse("200", "성공")
  @Response<ErrorResponse>(401, "로그인이 필요합니다.")
  @Response<ErrorResponse>(404, "존재하지 않는 미션입니다.")
  @Response<ErrorResponse>(409, "이미 완료된 미션입니다.")
  public async completeMission(
    @Path() userMissionId: number,
    @Request() request: ExRequest
  ): Promise<SR> {
    const result = await repo.completeMission(userMissionId);
    return { isSuccess: true, code: "2000", message: "성공", result };
  }
}