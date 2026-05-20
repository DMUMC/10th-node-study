import { StoreCreateRequest, bodyToStore, responseFromStore } from '../dtos/store.dto.js'
import { addStore, getStoreById } from '../repositories/store.repository.js'

const makeError = (message: string, status: number): Error & { status: number } => {
  const err = new Error(message) as Error & { status: number }
  err.status = status
  return err
}

export const createStore = async (data: StoreCreateRequest) => {
  const storeData = bodyToStore(data)
  const storeId = await addStore(storeData)

  const store = await getStoreById(storeId)
  if (!store) {
    throw makeError('가게 생성 후 조회에 실패했습니다.', 500)
  }

  return responseFromStore(store as {
    id: number
    name: string
    address: string
    region_id: number
  })
}
