import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest'
import { MongoClient, Db, InsertOneResult, UpdateResult } from 'mongodb'
import { DatabaseService } from './databaseService.js'

describe('DatabaseService', () => {
  let fakeCollection: {
    findOne: ReturnType<typeof vi.fn>
    countDocuments: ReturnType<typeof vi.fn>
    insertOne: ReturnType<typeof vi.fn>
    updateOne: ReturnType<typeof vi.fn>
  }
  let fakeDb: Db

  let connectSpy: any
  // eslint-disable-next-line no-unused-vars
  let dbSpy: any
  let closeSpy: any

  beforeEach(async () => {
    // Reset the connection before each test.
    await DatabaseService.disconnect()
    vi.restoreAllMocks()

    // Create a fake collection object to be returned by fakeDb.collection.
    fakeCollection = {
      findOne: vi.fn(),
      countDocuments: vi.fn(),
      insertOne: vi.fn(),
      updateOne: vi.fn(),
    }

    // Create a fake Db object whose collection method always returns the same fakeCollection.
    fakeDb = {
      // eslint-disable-next-line no-unused-vars
      collection: vi.fn().mockImplementation((name) => fakeCollection),
    } as unknown as Db

    // Set required environment variables.
    process.env.MONGO_URI = 'mongodb://localhost:27017'
    process.env.MONGO_DB_NAME = 'test-db'

    // Spy on MongoClient methods and provide the expected resolved values.
    connectSpy = vi
      .spyOn(MongoClient.prototype as any, 'connect')
      .mockResolvedValue({} as MongoClient)

    dbSpy = vi
      .spyOn(MongoClient.prototype as any, 'db')
      .mockImplementation(() => fakeDb)

    closeSpy = vi
      .spyOn(MongoClient.prototype as any, 'close')
      .mockResolvedValue(undefined)
  })

  afterEach(async () => {
    await DatabaseService.disconnect()
    vi.restoreAllMocks()
  })

  describe('connect', () => {
    it('should throw an error if MONGO_URI is not defined', async () => {
      delete process.env.MONGO_URI

      await expect(DatabaseService.connect()).rejects.toThrow(
        'MONGO_URI is not defined in the environment variables',
      )
    })

    it('should connect and return the db instance', async () => {
      const db = await DatabaseService.connect()

      expect(connectSpy).toHaveBeenCalled()
      expect(db).toBe(fakeDb)
    })

    it('should return the cached db instance on subsequent calls', async () => {
      const db1 = await DatabaseService.connect()
      const db2 = await DatabaseService.connect()

      // connect should be called only once because the instance is cached.
      expect(connectSpy).toHaveBeenCalledTimes(1)
      expect(db1).toBe(db2)
    })
  })

  describe('getCollection', () => {
    it('should throw an error if the database is not connected', () => {
      // Reset the internal db reference.
      DatabaseService['db'] = null
      expect(() => DatabaseService.getCollection('test')).toThrow(
        'Database not connected. Call connect() first.',
      )
    })

    it('should return a collection from the db', async () => {
      await DatabaseService.connect()

      const collectionName = 'test'
      const collection = DatabaseService.getCollection(collectionName)

      expect(fakeDb.collection).toHaveBeenCalledWith(collectionName)
      expect(collection).toBe(fakeCollection)
    })
  })

  describe('findOne', () => {
    it('should call collection.findOne with the query and default projection', async () => {
      const expectedResult = { name: 'test' }

      fakeCollection.findOne.mockResolvedValue(expectedResult)

      const query = { key: 'value' }
      const result = await DatabaseService.findOne(fakeCollection as any, query)

      expect(fakeCollection.findOne).toHaveBeenCalledWith(query, {
        projection: { _id: 0, createdAt: 0, updatedAt: 0 },
      })
      expect(result).toEqual(expectedResult)
    })

    it('should use provided options if given', async () => {
      const expectedResult = { name: 'test' }

      fakeCollection.findOne.mockResolvedValue(expectedResult)

      const query = { key: 'value' }
      const options = { projection: { name: 1 } }
      const result = await DatabaseService.findOne(
        fakeCollection as any,
        query,
        options,
      )

      expect(fakeCollection.findOne).toHaveBeenCalledWith(query, options)
      expect(result).toEqual(expectedResult)
    })
  })

  describe('countDocuments', () => {
    it('should call collection.countDocuments with the given query', async () => {
      fakeCollection.countDocuments.mockResolvedValue(5)

      const query = { active: true }
      const count = await DatabaseService.countDocuments(
        fakeCollection as any,
        query,
      )

      expect(fakeCollection.countDocuments).toHaveBeenCalledWith(query)
      expect(count).toBe(5)
    })
  })

  describe('insertDocument', () => {
    it('should insert a document with createdAt and updatedAt timestamps', async () => {
      // Use fake timers to control the current time.
      const now = new Date().toISOString()
      vi.useFakeTimers()
      vi.setSystemTime(new Date(now))

      fakeCollection.insertOne.mockResolvedValue({ insertedId: '123' })

      const doc = { name: 'test' }
      const result = await DatabaseService.insertDocument(
        fakeCollection as any,
        doc,
      )

      expect(fakeCollection.insertOne).toHaveBeenCalled()
      // Check that the inserted document contains the expected timestamp properties.
      const insertedDoc = fakeCollection.insertOne.mock.calls[0][0]

      expect(insertedDoc).toMatchObject({
        name: 'test',
        createdAt: now,
        updatedAt: now,
      })

      vi.useRealTimers()

      expect(result).toEqual({
        insertedId: '123',
      } as unknown as InsertOneResult<
        typeof doc & { createdAt: string; updatedAt: string }
      >)
    })
  })

  describe('updateDocument', () => {
    it('should update the document by adding updatedAt to an existing $set', async () => {
      const now = new Date().toISOString()
      vi.useFakeTimers()
      vi.setSystemTime(new Date(now))

      fakeCollection.updateOne.mockResolvedValue({
        matchedCount: 1,
        modifiedCount: 1,
      })

      const filter = { name: 'test' }
      const update = { $set: { field: 'value' } }
      const result = await DatabaseService.updateDocument(
        fakeCollection as any,
        filter,
        update,
      )

      expect(fakeCollection.updateOne).toHaveBeenCalled()

      const updateArg = fakeCollection.updateOne.mock.calls[0][1]

      // Ensure that updatedAt was added to the $set operator.
      expect(updateArg.$set).toHaveProperty('updatedAt', now)

      vi.useRealTimers()

      expect(result).toEqual({
        matchedCount: 1,
        modifiedCount: 1,
      } as UpdateResult)
    })

    it('should create a $set with updatedAt if not provided in the update', async () => {
      const now = new Date().toISOString()

      vi.useFakeTimers()
      vi.setSystemTime(new Date(now))

      fakeCollection.updateOne.mockResolvedValue({
        matchedCount: 1,
        modifiedCount: 1,
      })

      const filter = { name: 'test' }
      const update = { $inc: { counter: 1 } }
      const result = await DatabaseService.updateDocument(
        fakeCollection as any,
        filter,
        update,
      )

      expect(fakeCollection.updateOne).toHaveBeenCalled()

      const updateArg = fakeCollection.updateOne.mock.calls[0][1]

      // Ensure that a $set operator with updatedAt was created.
      expect(updateArg.$set).toHaveProperty('updatedAt', now)

      vi.useRealTimers()

      expect(result).toEqual({
        matchedCount: 1,
        modifiedCount: 1,
      } as UpdateResult)
    })
  })

  describe('disconnect', () => {
    it('should disconnect and reset client and db', async () => {
      await DatabaseService.connect()
      await DatabaseService.disconnect()
      expect(closeSpy).toHaveBeenCalled()

      // After disconnect, calling connect again should reinitialize the connection.
      await DatabaseService.connect()
      expect(connectSpy).toHaveBeenCalledTimes(2) // once for the first connect and once after disconnect
    })
  })
})
