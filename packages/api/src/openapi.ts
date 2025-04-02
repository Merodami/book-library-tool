import { OpenAPIV3 } from 'openapi-types'
import {
  UserIdSchema,
  BookSchema,
  BookRequestSchema,
  CatalogSearchQuerySchema,
  ReservationRequestSchema,
  ReservationSchema,
  ReservationReturnParamsSchema,
  WalletSchema,
  ErrorResponseSchema,
  BalanceWalletRequestSchema,
  LateReturnRequestSchema,
  BookIdSchema,
  UserSchema,
} from './schemas/index.js'

export const OpenAPISpec = {
  openapi: '3.0.0',
  info: {
    title: 'Book Library Tool API',
    version: '1.0.0',
    description:
      'API for managing book references, catalog search, reservations, and wallets.',
  },
  paths: {
    '/books': {
      post: {
        summary: 'Add a new book reference',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/BookRequest' },
              examples: {
                theTarget: {
                  summary: 'The Target by Catherine Coulter',
                  value: {
                    id: '0515125628',
                    title: 'The Target',
                    author: 'Catherine Coulter',
                    publicationYear: 1999,
                    publisher: 'Jove Books',
                    price: 27,
                  },
                },
                evolutionMan: {
                  summary: 'The Evolution Man or How I Ate My Father',
                  value: {
                    id: '0515125628',
                    title: 'The Evolution Man or How I Ate My Father',
                    author: 'Roy Lewis',
                    publicationYear: 1993,
                    publisher: 'Random House Inc',
                    price: 19,
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Book reference created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Book' },
                examples: {
                  theTarget: {
                    summary: 'The Target by Catherine Coulter',
                    value: {
                      id: '0515125628',
                      title: 'The Target',
                      author: 'Catherine Coulter',
                      publicationYear: 1999,
                      publisher: 'Jove Books',
                      price: 27,
                      createdAt: '2025-04-01T19:10:25.821Z',
                      updatedAt: '2025-04-01T19:10:25.821Z',
                    },
                  },
                  evolutionMan: {
                    summary: 'The Evolution Man or How I Ate My Father',
                    value: {
                      id: '0679427279',
                      title: 'The Evolution Man or How I Ate My Father',
                      author: 'Roy Lewis',
                      publicationYear: 1993,
                      publisher: 'Random House Inc',
                      price: 19,
                      createdAt: '2025-04-01T19:10:25.821Z',
                      updatedAt: '2025-04-01T19:10:25.821Z',
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                examples: {
                  invalidFormat: {
                    summary: 'Invalid book data format',
                    value: {
                      error: 'ValidationError',
                      message: ['publicationYear must be number'],
                    },
                  },
                },
              },
            },
          },
        },
        security: [{ ApiTokenAuth: [] }],
      },
    },
    '/books/{id}': {
      get: {
        summary: 'Get book by reference id',
        parameters: [
          {
            in: 'path',
            name: 'id',
            description: 'The identifier of the book to retrieve',
            required: true,
            schema: { $ref: '#/components/schemas/BookId' },
            examples: {
              bookId1: {
                summary: 'Book ISBN example',
                value: '0515125628',
              },
            },
          },
        ],
        responses: {
          '200': {
            description: 'Book found',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Book' },
                },
                examples: {
                  bookFound: {
                    summary: 'Book found successfully',
                    value: {
                      id: '0515125628',
                      title: 'The Target',
                      author: 'Catherine Coulter',
                      publicationYear: 1999,
                      publisher: 'Jove Books',
                      price: 27,
                      createdAt: '2025-04-01T19:10:25.821Z',
                      updatedAt: '2025-04-01T19:10:25.821Z',
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                examples: {
                  invalidId: {
                    summary: 'Invalid book ID',
                    value: {
                      error: 'ValidationError',
                      message: ['id must be string'],
                    },
                  },
                },
              },
            },
          },
        },
        security: [{ ApiTokenAuth: [] }],
      },
      delete: {
        summary: 'Delete a book reference by id',
        parameters: [
          {
            in: 'path',
            name: 'id',
            description: 'The identifier of the book to delete',
            required: true,
            schema: { $ref: '#/components/schemas/BookId' },
            examples: {
              bookId1: {
                summary: 'Book ISBN example',
                value: '0515125628',
              },
            },
          },
        ],
        responses: {
          '200': {
            description: 'Book reference deleted successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Book' },
                examples: {
                  deletedBook: {
                    summary: 'Book deleted successfully',
                  },
                },
              },
            },
          },
          '404': {
            description: 'Book not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                examples: {
                  bookNotFound: {
                    summary: 'Book not found',
                    value: {
                      error: 'ValidationError',
                      message: ['Book with ID 9999999999 not found'],
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                examples: {
                  invalidId: {
                    summary: 'Invalid book ID',
                    value: {
                      message: 'Invalid book ID format.',
                    },
                  },
                },
              },
            },
          },
        },
        security: [{ ApiTokenAuth: [] }],
      },
    },
    '/reservations': {
      post: {
        summary: 'Create a new reservation',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ReservationRequest' },
              examples: {
                newReservation: {
                  summary: 'New reservation request',
                  value: {
                    userId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                    referenceId: '1',
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Reservation created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Reservation' },
                examples: {
                  createdReservation: {
                    summary: 'Reservation created successfully',
                    value: {
                      reservationId: 'f7e6d5c4-b3a2-1098-7654-321fedcba012',
                      userId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                      referenceId: '0515125628',
                      reservedAt: '2025-04-01T12:30:45.678Z',
                      dueDate: '2025-04-06T12:30:45.678Z',
                      status: 'reserved',
                      feeCharged: 3,
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                examples: {
                  bookNotAvailable: {
                    summary: 'No copies available',
                    value: {
                      error: 'ValidationError',
                      message: ['No copies available for this book reference'],
                    },
                  },
                  userMaxBooks: {
                    summary: 'User has maximum books',
                    value: {
                      error: 'ValidationError',
                      message: [
                        'User cannot borrow more than 3 books at the same time',
                      ],
                    },
                  },
                  insufficientBalance: {
                    summary: 'Insufficient wallet balance',
                    value: {
                      error: 'ValidationError',
                      message: [
                        'User does not have enough balance to reserve a book',
                      ],
                    },
                  },
                },
              },
            },
          },
        },
        security: [{ ApiTokenAuth: [] }],
      },
    },
    '/reservations/user/{userId}': {
      get: {
        summary: 'Get reservation history for a user',
        parameters: [
          {
            in: 'path',
            name: 'userId',
            description: 'User identifier (UUID)',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            examples: {
              userId1: {
                summary: 'Example user ID',
                value: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
              },
            },
          },
        ],
        responses: {
          '200': {
            description: 'Reservation history for the user',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Reservation' },
                },
                examples: {
                  userReservations: {
                    summary: 'User reservation history',
                    value: [
                      {
                        reservationId: 'f7e6d5c4-b3a2-1098-7654-321fedcba012',
                        userId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                        referenceId: '0515125628',
                        reservedAt: '2025-04-01T12:30:45.678Z',
                        dueDate: '2025-04-06T12:30:45.678Z',
                        status: 'reserved',
                        feeCharged: 3,
                      },
                      {
                        reservationId: '11223344-5566-7788-99aa-bbccddeeff00',
                        userId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                        referenceId: '0679427279',
                        reservedAt: '2025-03-15T09:20:33.456Z',
                        dueDate: '2025-03-20T09:20:33.456Z',
                        status: 'returned',
                        feeCharged: 3,
                        updatedAt: '2025-03-19T14:25:10.789Z',
                      },
                    ],
                  },
                },
              },
            },
          },
          '400': {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                examples: {
                  invalidUserId: {
                    summary: 'Invalid user ID format',
                    value: {
                      error: 'ValidationError',
                      message: ['userId must be a valid UUID'],
                    },
                  },
                },
              },
            },
          },
        },
        security: [{ ApiTokenAuth: [] }],
      },
    },
    '/reservations/{reservationId}/return': {
      patch: {
        summary: 'Mark a reservation as returned',
        parameters: [
          {
            in: 'path',
            name: 'reservationId',
            description: 'Reservation identifier (UUID)',
            required: true,
            schema: { $ref: '#/components/schemas/ReservationReturnParams' },
            examples: {
              reservationId1: {
                summary: 'Example reservation ID',
                value: 'f7e6d5c4-b3a2-1098-7654-321fedcba012',
              },
            },
          },
        ],
        responses: {
          '200': {
            description: 'Reservation marked as returned',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                  },
                },
                examples: {
                  onTimeReturn: {
                    summary: 'Book returned on time',
                    value: {
                      message: 'Reservation marked as returned.',
                      late_fee_applied: '0.0',
                      days_late: 0,
                    },
                  },
                  lateReturn: {
                    summary: 'Book returned late',
                    value: {
                      message: 'Reservation marked as returned.',
                      late_fee_applied: '0.6',
                      days_late: 3,
                    },
                  },
                  bookBought: {
                    summary: 'Book considered bought due to high late fees',
                    value: {
                      message: 'Book considered bought due to high late fees.',
                      late_fee_applied: '27.0',
                      days_late: 135,
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                examples: {
                  invalidReservationId: {
                    summary: 'Invalid reservation ID',
                    value: {
                      error: 'ValidationError',
                      message: ['reservationId is required'],
                    },
                  },
                },
              },
            },
          },
          '404': {
            description: 'Reservation not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                examples: {
                  reservationNotFound: {
                    summary: 'Reservation not found',
                    value: {
                      error: 'ValidationError',
                      message: ['Active reservation not found'],
                    },
                  },
                },
              },
            },
          },
        },
        security: [{ ApiTokenAuth: [] }],
      },
    },
    '/wallets/{userId}': {
      get: {
        summary: 'Retrieve a user wallet',
        parameters: [
          {
            in: 'path',
            name: 'userId',
            description: 'User identifier (UUID)',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            examples: {
              userId1: {
                summary: 'Example user ID',
                value: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
              },
            },
          },
        ],
        responses: {
          '200': {
            description: 'User wallet details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Wallet' },
                examples: {
                  userWallet: {
                    summary: 'User wallet information',
                    value: {
                      userId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                      balance: 50.5,
                      createdAt: '2025-01-15T08:30:00.000Z',
                      updatedAt: '2025-04-01T14:45:20.123Z',
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                examples: {
                  invalidUserId: {
                    summary: 'Invalid user ID format',
                    value: {
                      message: 'Invalid user ID format.',
                    },
                  },
                },
              },
            },
          },
          '404': {
            description: 'Wallet not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                examples: {
                  walletNotFound: {
                    summary: 'Wallet not found',
                    value: {
                      error: 'ValidationError',
                      message: ['Wallet for user not found'],
                    },
                  },
                },
              },
            },
          },
        },
        security: [{ ApiTokenAuth: [] }],
      },
    },
    '/wallets/{userId}/balance': {
      post: {
        summary: 'Modify balance of a user wallet',
        parameters: [
          {
            in: 'path',
            name: 'userId',
            description: 'User identifier (UUID)',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            examples: {
              userId1: {
                summary: 'Example user ID',
                value: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
              },
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/BalanceWalletRequest' },
              examples: {
                addFunds: {
                  summary: 'Add funds to wallet',
                  value: {
                    amount: 20,
                  },
                },
                deductFunds: {
                  summary: 'Deduct funds from wallet',
                  value: {
                    amount: -3,
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Wallet updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Wallet' },
                examples: {
                  updatedWallet: {
                    summary: 'Updated wallet balance',
                    value: {
                      userId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                      balance: 67.5,
                      createdAt: '2025-01-15T08:30:00.000Z',
                      updatedAt: '2025-04-01T15:20:30.456Z',
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                examples: {
                  insufficientFunds: {
                    summary: 'Insufficient funds',
                    value: {
                      error: 'ValidationError',
                      message: ['Insufficient funds in wallet'],
                    },
                  },
                  invalidAmount: {
                    summary: 'Invalid amount',
                    value: {
                      error: 'ValidationError',
                      message: ['amount must be a number'],
                    },
                  },
                },
              },
            },
          },
        },
        security: [{ ApiTokenAuth: [] }],
      },
    },
    '/wallets/{userId}/late-return': {
      patch: {
        summary: 'Apply a late fee to a user wallet',
        parameters: [
          {
            in: 'path',
            name: 'userId',
            description: 'User identifier (UUID)',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            examples: {
              userId1: {
                summary: 'Example user ID',
                value: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
              },
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LateReturnRequest' },
              examples: {
                lateFee: {
                  summary: 'Late return fee calculation',
                  value: {
                    daysLate: 5,
                    retailPrice: 36,
                  },
                },
                longOverdue: {
                  summary: 'Long overdue book',
                  value: {
                    daysLate: 120,
                    retailPrice: 42.99,
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description:
              'Late fee applied. If fees reach or exceed the retail price, the book is considered bought.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    wallet: { $ref: '#/components/schemas/Wallet' },
                  },
                },
                examples: {
                  feeApplied: {
                    summary: 'Late fee applied',
                    value: {
                      message:
                        'Late fee of €1.00 applied for 5 days late return.',
                      wallet: {
                        userId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                        balance: 49.5,
                        createdAt: '2025-01-15T08:30:00.000Z',
                        updatedAt: '2025-04-01T15:30:10.789Z',
                      },
                    },
                  },
                  bookBought: {
                    summary: 'Book considered bought due to high late fees',
                    value: {
                      message:
                        'Late fees of €19.00 exceed or equal book retail price. Book marked as bought.',
                      wallet: {
                        userId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                        balance: 31.5,
                        createdAt: '2025-01-15T08:30:00.000Z',
                        updatedAt: '2025-04-01T15:35:22.345Z',
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                examples: {
                  invalidData: {
                    summary: 'Invalid request data',
                    value: {
                      error: 'ValidationError',
                      message: [
                        'daysLate must be provided',
                        'retailPrice must be provided',
                      ],
                    },
                  },
                },
              },
            },
          },
        },
        security: [{ ApiTokenAuth: [] }],
      },
    },
  },
  components: {
    schemas: {
      UserId: UserIdSchema,
      Book: BookSchema,
      BookId: BookIdSchema,
      BookRequest: BookRequestSchema,
      CatalogSearchQuery: CatalogSearchQuerySchema,
      ReservationRequest: ReservationRequestSchema,
      Reservation: ReservationSchema,
      ReservationReturnParams: ReservationReturnParamsSchema,
      Wallet: WalletSchema,
      ErrorResponse: ErrorResponseSchema,
      BalanceWalletRequest: BalanceWalletRequestSchema,
      LateReturnRequest: LateReturnRequestSchema,
      User: UserSchema,
    },
    securitySchemes: {
      ApiTokenAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: 'API token authentication. Use "Bearer <token>"',
      },
    },
  },
} as unknown as OpenAPIV3.Document
