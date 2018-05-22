import express, { Request, Response, Router } from 'express'

// tslint:disable-next-line:export-name
export const serverRouter: Router = express.Router()

// tslint:disable-next-line:no-implicit-dependencies
import API from 'api'

serverRouter.post('/welcome', (req: Request, res: Response) => {
  const request: API.Welcome.Request = <API.Welcome.Request>req.body
  const response: API.Welcome.Response = {
    message: `Hello from ${request.name}`
  }

  res.json(response)
})
