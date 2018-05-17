import express from 'express'
const router = express.Router()

import API from 'api'

router.post('/welcome', (req, res) => {
  const request = req.body as API.Welcome.Request

  res.json({
    message: `Hello from ${request.name}`
  } as API.Welcome.Response)
})

export default router
