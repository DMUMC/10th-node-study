import { Controller, Get, Patch, Path, Query, Route, Tags, Response as TsoaResponse } from 'tsoa'
import { listUserReviews } from '../../reviews/services/review.service.js'
import { listOngoingMissions, finishMission } from '../../missions/services/mission.service.js'
import { UserReviewListResponse } from '../../reviews/dtos/review.dto.js'
import { OngoingMissionListResponse, MissionChallengeResponse } from '../../missions/dtos/mission.dto.js'
import { ApiResponse, successResponse } from '../../../utils/response.js'

@Route('users')
@Tags('User')
export class UserController extends Controller {
  /**
   * 내 리뷰 목록 조회 API
   * @summary 특정 사용자가 작성한 리뷰 목록을 조회합니다.
   */
  @Get('{userId}/reviews')
  @TsoaResponse<ApiResponse<null>>(404, '사용자를 찾을 수 없음 (USER4001)')
  public async handleListUserReviews(
    /**
     * 리뷰를 조회할 사용자 ID
     */
    @Path() userId: number,
    /**
     * 커서 기반 페이지네이션 값
     */
    @Query() cursor?: number,
  ): Promise<ApiResponse<UserReviewListResponse>> {
    const result = await listUserReviews(userId, cursor ?? 0)
    return successResponse(result)
  }

  /**
   * 진행 중인 미션 목록 조회 API
   * @summary 특정 사용자가 현재 진행 중인 미션 목록을 조회합니다.
   */
  @Get('{userId}/missions')
  @TsoaResponse<ApiResponse<null>>(404, '사용자를 찾을 수 없음 (USER4001)')
  public async handleListOngoingMissions(
    /**
     * 미션 목록을 조회할 사용자 ID
     */
    @Path() userId: number,
    /**
     * 커서 기반 페이지네이션 값
     */
    @Query() cursor?: number,
  ): Promise<ApiResponse<OngoingMissionListResponse>> {
    const result = await listOngoingMissions(userId, cursor ?? 0)
    return successResponse(result)
  }

  /**
   * 미션 완료 처리 API
   * @summary 진행 중인 미션을 완료 상태로 변경합니다.
   */
  @Patch('{userId}/missions/{missionId}')
  @TsoaResponse<ApiResponse<null>>(404, '진행 중인 미션 없음 (MISSION4003)')
  @TsoaResponse<ApiResponse<null>>(404, '사용자를 찾을 수 없음 (USER4001)')
  public async handleCompleteMission(
    /**
     * 미션을 완료할 사용자 ID
     */
    @Path() userId: number,
    /**
     * 완료할 미션 ID
     */
    @Path() missionId: number,
  ): Promise<ApiResponse<MissionChallengeResponse>> {
    const result = await finishMission(userId, missionId)
    return successResponse(result)
  }
}
