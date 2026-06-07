import { Body, Controller, Patch, Post, Request, Route, Security, Tags, Response as TsoaResponse, SuccessResponse } from 'tsoa'
import { Request as ExRequest } from 'express'
import { MemberSignUpRequest, MemberSignUpResponse, UserUpdateRequest, UserUpdateResponse } from '../dtos/memberDto.js'
import { signUp, updateUserInfo } from '../services/memberService.js'
import { ApiResponse, successResponse } from '../../../utils/response.js'

@Route('members')
@Tags('Member')
export class MemberController extends Controller {
  /**
   * 회원가입 API
   * @summary 새로운 회원을 등록합니다.
   */
  @Post('signup')
  @SuccessResponse(201, '회원가입 성공')
  @TsoaResponse<ApiResponse<null>>(409, '이미 사용 중인 이메일 (USER4002)')
  @TsoaResponse<ApiResponse<null>>(400, 'name 누락 (USER4003)')
  public async handleSignUp(
    @Body() body: MemberSignUpRequest,
  ): Promise<ApiResponse<MemberSignUpResponse>> {
    this.setStatus(201)
    const result = await signUp(body)
    return successResponse(result)
  }

  /**
   * 내 정보 수정 API (미션 2)
   * @summary JWT로 인증된 사용자 본인의 정보를 수정합니다.
   * Google 로그인으로 가입 후 전화번호·생일 등 빈 필드를 채울 때 사용합니다.
   */
  @Patch('me')
  @Security('bearerAuth')
  @TsoaResponse<ApiResponse<null>>(401, '인증 토큰 없음 또는 만료 (AUTH4001)')
  @TsoaResponse<ApiResponse<null>>(404, '사용자를 찾을 수 없음 (USER4001)')
  public async handleUpdateMe(
    @Request() req: ExRequest,
    @Body() body: UserUpdateRequest,
  ): Promise<ApiResponse<UserUpdateResponse>> {
    const userId = (req.user as any).id
    const result = await updateUserInfo(userId, body)
    return successResponse(result)
  }
}
