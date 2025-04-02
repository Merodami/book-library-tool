import { Type, Static } from '@sinclair/typebox'
import { ReservationStatus } from '@book-library-tool/types'

/**
 * User id schema
 */
export const UserIdSchema = Type.Object(
  {
    userId: Type.String({ format: 'uuid' }),
  },
  { $id: '#/components/schemas/UserId' },
)
export type UserId = Static<typeof UserIdSchema>
export const UserIdRef = Type.Ref('#/components/schemas/UserId')

/**
 * Book reference id schema
 */
export const BookIdSchema = Type.Object(
  {
    referenceId: Type.String(),
  },
  { $id: '#/components/schemas/BookId' },
)
export type BookId = Static<typeof BookIdSchema>
export const BookIdRef = Type.Ref('#/components/schemas/BookId')

/**
 * Book Reference Schema
 */
export const BookSchema = Type.Object(
  {
    id: Type.String(),
    title: Type.String(),
    author: Type.String(),
    publicationYear: Type.Number(),
    publisher: Type.String(),
    price: Type.Number(),
  },
  { $id: '#/components/schemas/Book' },
)
export type Book = Static<typeof BookSchema>
export const BookRef = Type.Ref('#/components/schemas/Book')

/**
 * Add Reference Request Schema
 */
export const BookRequestSchema = Type.Object(
  {
    id: Type.String(),
    title: Type.String(),
    author: Type.String(),
    publicationYear: Type.Number(),
    publisher: Type.String(),
  },
  { $id: '#/components/schemas/BookRequest' },
)
export type BookRequest = Static<typeof BookRequestSchema>
export const BookRequestRef = Type.Ref('#/components/schemas/BookRequest')

/**
 * Catalog Search Query Schema
 */
export const CatalogSearchQuerySchema = Type.Partial(
  Type.Object({
    title: Type.String(),
    author: Type.String(),
    publicationYear: Type.Number(),
  }),
  { $id: '#/components/schemas/CatalogSearchQuery' },
)
export type CatalogSearchQuery = Static<typeof CatalogSearchQuerySchema>
export const CatalogSearchQueryRef = Type.Ref(
  '#/components/schemas/CatalogSearchQuery',
)

/**
 * Reservation Request Schema
 */
export const ReservationRequestSchema = Type.Object(
  {
    userId: Type.String({ format: 'uuid' }),
    referenceId: Type.String(),
  },
  { $id: '#/components/schemas/ReservationRequest' },
)
export type ReservationRequest = Static<typeof ReservationRequestSchema>
export const ReservationRequestRef = Type.Ref(
  '#/components/schemas/ReservationRequest',
)

/**
 * Reservation Schema
 */
export const ReservationSchema = Type.Object(
  {
    reservationId: Type.String({ format: 'uuid' }),
    userId: Type.String({ format: 'uuid' }),
    referenceId: Type.String(),
    reservedAt: Type.String({ format: 'date-time' }),
    dueDate: Type.String({ format: 'date-time' }),
    status: Type.Unsafe({
      type: 'string',
      enum: [
        ReservationStatus.RESERVED,
        ReservationStatus.BORROWED,
        ReservationStatus.RETURNED,
        ReservationStatus.LATE,
        ReservationStatus.BOUGHT,
      ],
    }),
    feeCharged: Type.Optional(Type.Number()),
  },
  { $id: '#/components/schemas/Reservation' },
)
export type Reservation = Static<typeof ReservationSchema>
export const ReservationRef = Type.Ref('#/components/schemas/Reservation')

/**
 * Reservation return schema
 */
export const ReservationReturnParamsSchema = Type.Object(
  {
    reservationId: Type.String({ format: 'uuid' }),
  },
  { $id: '#/components/schemas/ReservationReturnParams' },
)
export type ReservationReturnParams = Static<
  typeof ReservationReturnParamsSchema
>
export const ReservationReturnParamsRef = Type.Ref(
  '#/components/schemas/ReservationReturnParams',
)

/**
 * Wallet schema
 */
export const WalletSchema = Type.Object(
  {
    userId: Type.String({ format: 'uuid' }),
    balance: Type.Number(),
  },
  { $id: '#/components/schemas/Wallet' },
)
export type Wallet = Static<typeof WalletSchema>
export const WalletRef = Type.Ref('#/components/schemas/Wallet')

/**
 * Error Response Schema
 */
export const ErrorResponseSchema = Type.Object(
  {
    error: Type.String(),
    message: Type.String(),
  },
  { $id: '#/components/schemas/ErrorResponse' },
)
export type ErrorResponse = Static<typeof ErrorResponseSchema>
export const ErrorResponseRef = Type.Ref('#/components/schemas/ErrorResponse')

/**
 * Balance Wallet Request Schema
 */
export const BalanceWalletRequestSchema = Type.Object(
  {
    amount: Type.Number(),
  },
  { $id: '#/components/schemas/BalanceWalletRequest' },
)
export type BalanceWalletRequest = Static<typeof BalanceWalletRequestSchema>

/**
 * Late Return Request Schema
 */
export const LateReturnRequestSchema = Type.Object(
  {
    daysLate: Type.Number(),
    retailPrice: Type.Number(),
  },
  { $id: '#/components/schemas/LateReturnRequest' },
)
export type LateReturnRequest = Static<typeof LateReturnRequestSchema>

/**
 * User Schema
 */
export const UserSchema = Type.Object(
  {
    userId: Type.String({ format: 'uuid' }),
    email: Type.String({ format: 'email' }),
    role: Type.String(),
  },
  { $id: '#/components/schemas/User' },
)
export type User = Static<typeof UserSchema>
export const UserRef = Type.Ref('#/components/schemas/User')
