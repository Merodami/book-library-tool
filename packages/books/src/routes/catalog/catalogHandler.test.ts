import { describe, beforeEach, afterEach, test, expect, vi } from 'vitest'
import { catalogHandler } from './catalogHandler.js'
import { DatabaseService } from '@book-library-tool/database'
import type { Book } from '@book-library-tool/sdk'

// We assume that your books have createdAt and updatedAt properties.
describe('catalogHandler.searchCatalog', () => {
  let fakeBooksCollection: any
  let req: any
  let res: any
  let next: any

  beforeEach(() => {
    // Create a fake books collection with a mocked find() method.
    fakeBooksCollection = {
      find: vi.fn(),
    }

    // Stub DatabaseService.getCollection to always return our fakeBooksCollection.
    vi.spyOn(DatabaseService, 'getCollection').mockReturnValue(
      fakeBooksCollection,
    )

    // Setup basic Express mocks.
    req = { query: {} }
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    }
    next = vi.fn()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  test('should search catalog with valid query parameters', async () => {
    // Arrange: valid query parameters.
    req.query = {
      title: 'Test',
      author: 'Author',
      publicationYear: '2022',
    }

    // Sample books array to be returned.
    const sampleBooks: (Book & { createdAt: string; updatedAt: string })[] = [
      {
        id: 'book1',
        title: 'Test Book',
        author: 'Author Name',
        publicationYear: 2022,
        publisher: 'Publisher 1',
        price: 20,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    // Setup find() to return a fake cursor with a toArray() method.
    fakeBooksCollection.find.mockReturnValue({
      toArray: vi.fn().mockResolvedValue(sampleBooks),
    })

    // Act
    await catalogHandler.searchCatalog(req, res, next)

    // Assert: Verify that the books collection was retrieved.
    expect(DatabaseService.getCollection).toHaveBeenCalledWith('books')

    // Verify that the filter was built correctly.
    const filterUsed = fakeBooksCollection.find.mock.calls[0][0]
    expect(filterUsed).toHaveProperty('title')
    expect(filterUsed).toHaveProperty('author')
    expect(filterUsed).toHaveProperty('publicationYear', 2022)
    expect(filterUsed.title.$regex).toBeInstanceOf(RegExp)
    expect(filterUsed.title.$regex.source).toContain('Test')
    expect(filterUsed.title.$regex.flags).toContain('i')
    expect(filterUsed.author.$regex).toBeInstanceOf(RegExp)
    expect(filterUsed.author.$regex.source).toContain('Author')
    expect(filterUsed.author.$regex.flags).toContain('i')

    // Verify that response is returned with status 200 and the sample books.
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(sampleBooks)
  })

  test('should search catalog with no query parameters and return all books', async () => {
    // Arrange: no query parameters.
    req.query = {}

    const sampleBooks: (Book & { createdAt: string; updatedAt: string })[] = [
      {
        id: 'book2',
        title: 'Another Book',
        author: 'Another Author',
        publicationYear: 2020,
        publisher: 'Publisher 2',
        price: 15,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    fakeBooksCollection.find.mockReturnValue({
      toArray: vi.fn().mockResolvedValue(sampleBooks),
    })

    // Act
    await catalogHandler.searchCatalog(req, res, next)

    // Assert: The filter should be empty.
    expect(fakeBooksCollection.find).toHaveBeenCalledWith(
      {},
      { projection: { _id: 0 } },
    )

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(sampleBooks)
  })

  test('should return 400 if publicationYear is invalid', async () => {
    // Arrange: invalid publicationYear parameter.
    req.query = { publicationYear: 'invalid' }

    // Act
    await catalogHandler.searchCatalog(req, res, next)

    // Assert: Return a 400 error response.
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid publicationYear parameter.',
    })
  })

  test('should call next with error if an exception occurs', async () => {
    // Arrange: Simulate an error when retrieving books.
    const error = new Error('Test error')
    req.query = { title: 'Test' }
    fakeBooksCollection.find.mockReturnValue({
      toArray: vi.fn().mockRejectedValue(error),
    })

    // Act
    await catalogHandler.searchCatalog(req, res, next)

    // Assert: next() should be called with the error.
    expect(next).toHaveBeenCalledWith(error)
  })
})
