import { Body, Controller, Get, Path, Post, Query, Route, Tags, Response as TsoaResponse, SuccessResponse } from 'tsoa'
import { StoreCreateRequest, StoreCreateResponse, ReviewListResponse } from '../dtos/store.dto.js'
import { createStore, listStoreReviews } from '../services/store.service.js'
import { createReview } from '../../reviews/services/review.service.js'
import { createMission, listStoreMissions } from '../../missions/services/mission.service.js'
import { ReviewCreateRequest, ReviewCreateResponse } from '../../reviews/dtos/review.dto.js'
import { MissionCreateRequest, MissionCreateResponse, StoreMissionListResponse } from '../../missions/dtos/mission.dto.js'
import { ApiResponse, successResponse } from '../../../utils/response.js'

@Route('stores')
@Tags('Store')
export class StoreController extends Controller {
  /**
   * 가게 생성 API
   * @summary 새로운 가게를 등록합니다.
   */
  @Post()
  @SuccessResponse(201, '가게 생성 성공')
  @TsoaResponse<ApiResponse<null>>(400, '잘못된 요청 (COMMON400)')
  public async handleCreateStore(
    @Body() body: StoreCreateRequest,
  ): Promise<ApiResponse<StoreCreateResponse>> {
    this.setStatus(201)
    const result = await createStore(body)
    return successResponse(result)
  }

  /**
   * 가게 리뷰 목록 조회 API
   * @summary 특정 가게의 리뷰 목록을 커서 기반으로 조회합니다.
   */
  @Get('{storeId}/reviews')
  @TsoaResponse<ApiResponse<null>>(404, '존재하지 않는 가게 (STORE4001)')
  public async handleListStoreReviews(
    /**
     * 리뷰를 조회할 가게 ID
     */
    @Path() storeId: number,
    /**
     * 커서 기반 페이지네이션 값 (이전 응답의 cursor)
     */
    @Query() cursor?: number,
  ): Promise<ApiResponse<ReviewListResponse>> {
    const result = await listStoreReviews(storeId, cursor ?? 0)
    return successResponse(result)
  }

  /**
   * 리뷰 작성 API
   * @summary 특정 가게에 리뷰를 작성합니다.
   */
  @Post('{storeId}/reviews')
  @SuccessResponse(201, '리뷰 작성 성공')
  @TsoaResponse<ApiResponse<null>>(400, '별점 범위 오류 (REVIEW4001)')
  @TsoaResponse<ApiResponse<null>>(404, '존재하지 않는 가게 (STORE4001)')
  public async handleCreateReview(
    /**
     * 리뷰를 작성할 가게 ID
     */
    @Path() storeId: number,
    @Body() body: ReviewCreateRequest,
  ): Promise<ApiResponse<ReviewCreateResponse>> {
    this.setStatus(201)
    const result = await createReview(storeId, body)
    return successResponse(result)
  }

  /**
   * 가게 미션 목록 조회 API
   * @summary 특정 가게에 등록된 미션 목록을 조회합니다.
   */
  @Get('{storeId}/missions')
  @TsoaResponse<ApiResponse<null>>(404, '존재하지 않는 가게 (STORE4001)')
  public async handleListStoreMissions(
    /**
     * 미션 목록을 조회할 가게 ID
     */
    @Path() storeId: number,
    /**
     * 커서 기반 페이지네이션 값
     */
    @Query() cursor?: number,
  ): Promise<ApiResponse<StoreMissionListResponse>> {
    const result = await listStoreMissions(storeId, cursor ?? 0)
    return successResponse(result)
  }

  /**
   * 미션 생성 API
   * @summary 특정 가게에 새로운 미션을 등록합니다.
   */
  @Post('{storeId}/missions')
  @SuccessResponse(201, '미션 생성 성공')
  @TsoaResponse<ApiResponse<null>>(404, '존재하지 않는 가게 (STORE4001)')
  public async handleCreateMission(
    /**
     * 미션을 등록할 가게 ID
     */
    @Path() storeId: number,
    @Body() body: MissionCreateRequest,
  ): Promise<ApiResponse<MissionCreateResponse>> {
    this.setStatus(201)
    const result = await createMission(storeId, body)
    return successResponse(result)
  }
}
