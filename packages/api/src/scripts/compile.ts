import fs from 'fs-extra'
import path from 'path'
import { OpenAPIV3 } from 'openapi-types'
import SwaggerParser from '@apidevtools/swagger-parser'
import { cloneDeep } from 'lodash-es'
import { OpenAPISpec } from '../openapi.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Utility: resolve paths from project root
const fromRoot = (...args: string[]) => path.join(__dirname, '../..', ...args)

/**
 * Recursively remove any $id properties from an object.
 */
function removeIdProperties(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(removeIdProperties)
  } else if (obj && typeof obj === 'object') {
    const newObj: any = {}

    for (const key of Object.keys(obj)) {
      if (key === '$id') continue

      newObj[key] = removeIdProperties(obj[key])
    }

    return newObj
  }

  return obj
}

async function main() {
  try {
    // Clone the spec to avoid mutating the original
    const spec: OpenAPIV3.Document = cloneDeep(OpenAPISpec)

    // Remove $id properties from the spec so that it complies with OpenAPI
    const cleanedSpec = removeIdProperties(spec)

    // Validate the cleaned OpenAPI spec (this also dereferences $refs)
    await SwaggerParser.validate(cleanedSpec)
    console.log('OpenAPI spec is valid.')

    // Prepare the output directory (e.g. "dist")
    const outputDir = fromRoot('dist')
    await fs.ensureDir(outputDir)

    // Write the complete OpenAPI spec JSON
    const jsonPath = path.join(outputDir, 'openapi.json')
    await fs.writeFile(jsonPath, JSON.stringify(cleanedSpec, null, 2))
    console.log(`OpenAPI JSON written to ${jsonPath}`)

    // Optionally, generate HTML documentation.
    const templatePath = fromRoot('src', 'docs-template.html')

    if (await fs.pathExists(templatePath)) {
      const template = await fs.readFile(templatePath, 'utf8')

      // Replace placeholders in the template. Adjust placeholders as needed.
      const htmlOutput = template
        .replace('{{SPEC}}', JSON.stringify(cleanedSpec))
        .replace('{{TITLE}}', cleanedSpec.info.title)

      const htmlPath = path.join(outputDir, 'openapi.html')

      await fs.writeFile(htmlPath, htmlOutput)

      console.log(`OpenAPI HTML documentation written to ${htmlPath}`)
    } else {
      console.warn(
        `Template file not found at ${templatePath}. Skipping HTML generation.`,
      )
    }
  } catch (error) {
    console.error('Error compiling OpenAPI spec:', error)
    process.exit(1)
  }
}

main()
