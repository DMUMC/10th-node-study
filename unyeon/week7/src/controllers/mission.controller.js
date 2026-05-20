import { StatusCodes } from 'http-status-codes'
import { bodyToMission } from '../dtos/mission.dto.js'
import {
  createMission,
  challengeMission,
} from '../services/mission.service.js'

// 3. 가게에 미션 추가
export const handleCreateMission = async (req, res, next) => {
  try {
    const { storeId } = req.params
    const result = await createMission(bodyToMission(storeId, req.body))
    res.status(StatusCodes.CREATED).success(result)
  } catch (err) {
    next(err)
  }
}

// 4. 미션 도전하기 (필수 API)
export const handleChallengeMission = async (req, res, next) => {
  try {
    const { missionId } = req.params
    // 이번 주차는 "DB에 저장된 첫 번째 사용자"로 가정 → memberId = 1
    const memberId = 1
    const result = await challengeMission({
      memberId,
      missionId: Number(missionId),
    })
    res.status(StatusCodes.CREATED).success(result)
  } catch (err) {
    next(err)
  }
}
