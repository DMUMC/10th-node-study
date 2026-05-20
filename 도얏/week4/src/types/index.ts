export interface Member {
  id: number
  name: string
  nickname: string
  email: string
  password: string
  point: number
  createdAt: string
}

export interface Store {
  id: number
  name: string
  address: string
}

export interface Review {
  id: number
  storeId: number
  memberId: number
  content: string
  score: number
  createdAt: string
}

export interface Mission {
  id: number
  storeId: number
  title: string
  reward: number
  deadline: string
  missionSpec: string
}

export interface MemberMission {
  id: number
  memberId: number
  missionId: number
  status: 'CHALLENGING' | 'COMPLETE'
  createdAt: string
}

export interface PageResult<T> {
  missions: T[]
  totalPages: number
  currentPage: number
  isLast: boolean
}

// Express Request에 memberId 주입을 위한 타입 확장
declare global {
  namespace Express {
    interface Request {
      memberId?: number
    }
  }
}
