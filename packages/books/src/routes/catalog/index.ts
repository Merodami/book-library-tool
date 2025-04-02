import { Router } from 'express'
import { catalogHandler } from './catalogHandler.js'
import { schemas, validateQuery } from '@book-library-tool/api'

export default Router().get(
  '/',
  validateQuery(schemas.CatalogSearchQuerySchema),
  catalogHandler.searchCatalog,
)
