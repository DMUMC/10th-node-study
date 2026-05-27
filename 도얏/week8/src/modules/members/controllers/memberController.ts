import { Body, Controller, Post, Route, Tags, Response as TsoaResponse, SuccessResponse } from 'tsoa'
import {
  MemberLoginRequest,
  MemberLoginResponse,
  MemberSignUpRequest,
  MemberSignUpResponse,
} from '../dtos/memberDto.js'
import { login, signUp } from '../services/memberService.js'
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
  @TsoaResponse<ApiResponse<null>>(400, '필수 입력값 누락 (USER4003)')
  public async handleSignUp(
    @Body() body: MemberSignUpRequest,
  ): Promise<ApiResponse<MemberSignUpResponse>> {
    this.setStatus(201)
    const result = await signUp(body)
    return successResponse(result)
  }

  /**
   * 로그인 API
   * @summary 이메일과 비밀번호로 로그인합니다.
   */
  @Post('login')
  @TsoaResponse<ApiResponse<null>>(401, '이메일 또는 비밀번호 불일치 (AUTH4001)')
  @TsoaResponse<ApiResponse<null>>(400, '필수 입력값 누락 (USER4003)')
  public async handleLogin(
    @Body() body: MemberLoginRequest,
  ): Promise<ApiResponse<MemberLoginResponse>> {
    const result = await login(body)
    return successResponse(result)
  }
}
