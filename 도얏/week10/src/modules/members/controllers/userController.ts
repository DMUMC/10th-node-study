import { Controller, Get, Patch, Path, Query, Request, Route, Security, Tags, Response as TsoaResponse } from 'tsoa'
import { Request as ExRequest } from 'express'
import { listUserReviews } from '../../reviews/services/reviewService.js'
import { listOngoingMissions, finishMission } from '../../missions/services/missionService.js'
import { UserReviewListResponse } from '../../reviews/dtos/reviewDto.js'
import { OngoingMissionListResponse, MissionChallengeResponse } from '../../missions/dtos/missionDto.js'
import { ApiResponse, successResponse } from '../../../utils/response.js'

@Route('users')
@Tags('User')
export class UserController extends Controller {
  /**
   * 내 리뷰 목록 조회 API
   * @summary 로그인한 사용자 본인이 작성한 리뷰 목록을 조회합니다.
   */
  @Get('me/reviews')
  @Security('bearerAuth')
  @TsoaResponse<ApiResponse<null>>(401, '인증 토큰 없음 또는 만료 (AUTH4001)')
  @TsoaResponse<ApiResponse<null>>(404, '사용자를 찾을 수 없음 (USER4001)')
  public async handleListUserReviews(
    @Request() req: ExRequest,
    /**
     * 커서 기반 페이지네이션 값
     */
    @Query() cursor?: number,
  ): Promise<ApiResponse<UserReviewListResponse>> {
    const userId = (req.user as any).id
    const result = await listUserReviews(userId, cursor ?? 0)
    return successResponse(result)
  }

  /**
   * 진행 중인 미션 목록 조회 API
   * @summary 로그인한 사용자 본인이 현재 진행 중인 미션 목록을 조회합니다.
   */
  @Get('me/missions')
  @Security('bearerAuth')
  @TsoaResponse<ApiResponse<null>>(401, '인증 토큰 없음 또는 만료 (AUTH4001)')
  @TsoaResponse<ApiResponse<null>>(404, '사용자를 찾을 수 없음 (USER4001)')
  public async handleListOngoingMissions(
    @Request() req: ExRequest,
    /**
     * 커서 기반 페이지네이션 값
     */
    @Query() cursor?: number,
  ): Promise<ApiResponse<OngoingMissionListResponse>> {
    const userId = (req.user as any).id
    const result = await listOngoingMissions(userId, cursor ?? 0)
    return successResponse(result)
  }

  /**
   * 미션 완료 처리 API
   * @summary 로그인한 사용자 본인의 진행 중인 미션을 완료 상태로 변경합니다.
   */
  @Patch('me/missions/{missionId}')
  @Security('bearerAuth')
  @TsoaResponse<ApiResponse<null>>(401, '인증 토큰 없음 또는 만료 (AUTH4001)')
  @TsoaResponse<ApiResponse<null>>(404, '진행 중인 미션 없음 (MISSION4003)')
  @TsoaResponse<ApiResponse<null>>(404, '사용자를 찾을 수 없음 (USER4001)')
  public async handleCompleteMission(
    @Request() req: ExRequest,
    /**
     * 완료할 미션 ID
     */
    @Path() missionId: number,
  ): Promise<ApiResponse<MissionChallengeResponse>> {
    const userId = (req.user as any).id
    const result = await finishMission(userId, missionId)
    return successResponse(result)
  }
}
