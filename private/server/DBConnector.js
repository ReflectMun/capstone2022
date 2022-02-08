import { createPool } from 'mysql2/promise'
import { readFileSync } from 'fs'

const credentialFile = readFileSync(
    'private/credential/db.json',
    { encoding: 'utf-8' }
)

const DBCredentialJSON = JSON.parse(credentialFile)

const Pool = createPool(DBCredentialJSON)

export default Pool