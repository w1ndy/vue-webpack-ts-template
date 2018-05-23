// tslint:disable-next-line:match-default-export-name
import express, { Request, Response, Router } from 'express'
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
