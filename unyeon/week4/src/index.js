import express from 'express'
import { memberRouter } from './routes/member.route.js'
import { storeRouter } from './routes/store.route.js'
import { missionRouter } from './routes/mission.route.js'

const app = express()
const port = 3000

app.use(express.json())

app.use('/api/v1/members', memberRouter)
app.use('/api/v1/stores', storeRouter)
app.use('/api/v1/missions', missionRouter)

app.get('/', (req, res) => {
  res.send('UMC 4주차 서버 실행 중!')
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
