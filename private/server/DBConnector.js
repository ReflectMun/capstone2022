import { createPool } from 'mysql2/promise'
import { readFileSync } from 'fs'

const credentialFile = readFileSync(
    'private/credential/db.json',
    { encoding: 'utf-8' }
)

const DBCredentialJSON = JSON.parse(credentialFile)

const Pool = createPool({
    host: DBCredentialJSON.host,
    user: DBCredentialJSON.user,
    password: DBCredentialJSON.password,
    database: DBCredentialJSON.database,
    port: DBCredentialJSON.port
})

export default Pool