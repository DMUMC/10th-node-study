import { Body, Controller, Post, Route, Tags, Response as TsoaResponse, SuccessResponse } from 'tsoa'
import { MemberSignUpRequest, MemberSignUpResponse } from '../dtos/member.dto.js'
import { signUp } from '../services/member.service.js'
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
  @TsoaResponse<ApiResponse<null>>(400, 'name 또는 nickname 누락 (USER4003)')
  public async handleSignUp(
    @Body() body: MemberSignUpRequest,
  ): Promise<ApiResponse<MemberSignUpResponse>> {
    this.setStatus(201)
    const result = await signUp(body)
    return successResponse(result)
  }
}
