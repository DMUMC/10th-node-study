import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { MemberSignUpRequest } from '../dtos/member.dto.js'
import { signUp } from '../services/member.service.js'

// POST /api/v1/members/signup
export const handleSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await signUp(req.body as MemberSignUpRequest)
    res.status(StatusCodes.CREATED).json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}
