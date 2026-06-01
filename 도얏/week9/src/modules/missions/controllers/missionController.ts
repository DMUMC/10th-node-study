import { Body, Controller, Path, Post, Request, Route, Security, Tags, Response as TsoaResponse, SuccessResponse } from 'tsoa'
import { Request as ExRequest } from 'express'
import { MissionChallengeRequest, MissionChallengeResponse } from '../dtos/missionDto.js'
import { challengeMission } from '../services/missionService.js'
import { ApiResponse, successResponse } from '../../../utils/response.js'

@Route('missions')
@Tags('Mission')
export class MissionController extends Controller {
  /**
   * 미션 도전 API
   * @summary 특정 미션에 도전(참여)합니다. (로그인 필요)
   */
  @Post('{missionId}/challenge')
  @Security('bearerAuth')
  @SuccessResponse(201, '미션 도전 성공')
  @TsoaResponse<ApiResponse<null>>(401, '인증 토큰 없음 또는 만료 (AUTH4001)')
  @TsoaResponse<ApiResponse<null>>(409, '이미 도전 중인 미션 (MISSION4002)')
  @TsoaResponse<ApiResponse<null>>(404, '존재하지 않는 미션 (MISSION4001)')
  public async handleChallengeMission(
    /**
     * 도전할 미션 ID
     */
    @Path() missionId: number,
    @Request() req: ExRequest,
    @Body() body: MissionChallengeRequest,
  ): Promise<ApiResponse<MissionChallengeResponse>> {
    this.setStatus(201)
    const userId = (req.user as any).id
    const result = await challengeMission(missionId, userId, body)
    return successResponse(result)
  }
}
