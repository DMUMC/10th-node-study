import { Body, Controller, Path, Post, Route, Tags, Response as TsoaResponse, SuccessResponse } from 'tsoa'
import { MissionChallengeRequest, MissionChallengeResponse } from '../dtos/mission.dto.js'
import { challengeMission } from '../services/mission.service.js'
import { ApiResponse, successResponse } from '../../../utils/response.js'

@Route('missions')
@Tags('Mission')
export class MissionController extends Controller {
  /**
   * 미션 도전 API
   * @summary 특정 미션에 도전(참여)합니다.
   */
  @Post('{missionId}/challenge')
  @SuccessResponse(201, '미션 도전 성공')
  @TsoaResponse<ApiResponse<null>>(409, '이미 도전 중인 미션 (MISSION4002)')
  @TsoaResponse<ApiResponse<null>>(404, '존재하지 않는 미션 (MISSION4001)')
  public async handleChallengeMission(
    /**
     * 도전할 미션 ID
     */
    @Path() missionId: number,
    @Body() body: MissionChallengeRequest,
  ): Promise<ApiResponse<MissionChallengeResponse>> {
    this.setStatus(201)
    const result = await challengeMission(missionId, body)
    return successResponse(result)
  }
}
