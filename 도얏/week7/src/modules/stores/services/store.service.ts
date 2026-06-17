import { StoreCreateRequest, bodyToStore, responseFromStore, responseFromReviews } from '../dtos/store.dto.js'
import { addStore, getStoreById, getAllStoreReviews } from '../repositories/store.repository.js'
import { BaseError } from '../../../utils/errors.js'
import { ErrorCode } from '../../../utils/errorCode.js'

export const listStoreReviews = async (storeId: number, cursor: number) => {
  const reviews = await getAllStoreReviews(storeId, cursor)
  return responseFromReviews(reviews)
}

export const createStore = async (data: StoreCreateRequest) => {
  const storeData = bodyToStore(data)
  const storeId = await addStore(storeData)

  const store = await getStoreById(storeId)
  if (!store) {
    throw new BaseError(
      ErrorCode.STORE_CREATE_FAILED.message,
      ErrorCode.STORE_CREATE_FAILED.status,
      ErrorCode.STORE_CREATE_FAILED.code,
    )
  }

  return responseFromStore(store as {
    id: number
    name: string
    address: string
    region_id: number
  })
}
