import { Router } from 'express'
import { reservationHandler } from './reservationHandler.js'
import { validateBody, validateParams } from '@book-library-tool/api'
import { schemas } from '@book-library-tool/api'

export default Router()
  .post(
    '/',
    validateBody(schemas.ReservationRequestSchema),
    reservationHandler.createReservation,
  )
  .get(
    '/user/:userId',
    validateParams(schemas.UserIdSchema),
    reservationHandler.getReservationHistory,
  )
  .patch(
    '/:reservationId/return',
    validateParams(schemas.ReservationReturnParamsSchema),
    reservationHandler.returnReservation,
  )
