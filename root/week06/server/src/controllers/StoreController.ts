import { Controller, Get, Path, Route, Response, SuccessResponse, Tags } from "tsoa";
import * as repo from "../repositories/store.repository";
import { ErrorResponse, SuccessResponse as SR } from "../types";

@Route("api/stores")
@Tags("Store")
export class StoreController extends Controller {

  /**
   * 특정 가게의 미션 목록을 조회합니다.
   */
  @Get("{storeId}/missions")
  @SuccessResponse("200", "성공")
  @Response<ErrorResponse>(404, "존재하지 않는 가게입니다.")
  public async getStoreMissions(
    @Path() storeId: number
  ): Promise<SR> {
    const result = await repo.getStoreMissions(storeId);
    return { isSuccess: true, code: "2000", message: "성공", result };
  }
}