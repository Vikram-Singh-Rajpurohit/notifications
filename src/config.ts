import { readFileSync } from 'fs'
import * as yaml from 'js-yaml'
import { join } from 'path'

export default () => {
  let YAML_CONFIG_FILENAME: string

  switch (process.env.NODE_ENVIRONMENT) {
    case 'production':
      YAML_CONFIG_FILENAME = '../config.prod.yml'
      break
    case 'staging':
      YAML_CONFIG_FILENAME = '../config.staging.yml'
      break
    default:
      YAML_CONFIG_FILENAME = '../config.dev.yml'
      break
  }
  return yaml.load(readFileSync(join(__dirname, YAML_CONFIG_FILENAME), 'utf8')) as Record<string, any>
}
