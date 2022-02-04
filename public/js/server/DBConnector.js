import { createPool } from 'mysql2/promise'

const Pool = createPool({
    // DB에 연결하는 커넥션 풀을 만드는 함수, 실제 연결은 await Pool.getConnection() 으로 따로 해야함
    host: 'maindb.cxoty2vxx2ed.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'MainDBvotmdnjem!!',
    database: 'MainDB',
    port: 3306
})

export default Pool