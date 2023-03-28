import express from 'express'
import cors from 'cors'
import {v4 as uuidv4} from 'uuid'
import bodyParser from 'body-parser'
import Main from '..'

const app = express()
const port = 2163

const jsonParser = bodyParser.json()

app.use(cors())
app.use(jsonParser)

export interface AuthorizationRequest {
  token: string
  deviceName: string
  status: 'pending' | 'accepted' | 'rejected'
}

export const pendingRequests: AuthorizationRequest[] = []

app.post('/init', (req, res) => {
  const params = req.body
  const token = uuidv4()

  const pendingRequest: AuthorizationRequest = {
    token,
    deviceName: params.deviceName,
    status: 'pending'
  }

  pendingRequests.push(pendingRequest)
  sendAuthorizationRequestToMaster(pendingRequest)

  res.end(JSON.stringify(pendingRequest))
})

app.post('/get-status', (req, res) => {
  const {token} = req.body
  const pendingRequest = pendingRequests.find(request => request.token === token)
  res.end(JSON.stringify(pendingRequest))
})

app.post('/test-connection', (req, res) => {
  res.end(JSON.stringify({success: true}))
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

export function respondToRequest(token: string, status: 'accepted' | 'rejected') {
  console.log({
    token,
    status
  })
  const pendingRequest = pendingRequests.find(request => request.token === token)
  if (pendingRequest) {
    pendingRequest.status = status
  }
}

function sendAuthorizationRequestToMaster(request: AuthorizationRequest) {
  console.log('Sending request to master')
  console.log(request)
  Main.mainWindow.webContents.send(`intraSync:onNewAuthorizationRequest`, request)
}
