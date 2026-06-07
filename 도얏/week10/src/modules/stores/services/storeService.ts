import { StoreCreateRequest, bodyToStore, responseFromStore, responseFromReviews } from '../dtos/storeDto.js'
import { addStore, getStoreById, getAllStoreReviews } from '../repositories/storeRepository.js'
import { BaseError } from '../../../utils/errors.js'
import { ErrorCode } from '../../../utils/errorCode.js'

export const listStoreReviews = async (storeId: number, cursor: number) => {
  const store = await getStoreById(storeId)
  if (!store) {
    throw new BaseError(ErrorCode.STORE_NOT_FOUND)
  }

  const reviews = await getAllStoreReviews(storeId, cursor)
  return responseFromReviews(reviews)
}

export const createStore = async (data: StoreCreateRequest) => {
  const storeData = bodyToStore(data)
  const storeId = await addStore(storeData)

  const store = await getStoreById(storeId)
  if (!store) {
    throw new BaseError(ErrorCode.STORE_CREATE_FAILED)
  }

  return responseFromStore(store)
}
