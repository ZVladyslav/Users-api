import jwt from 'jsonwebtoken'
import { usersFactory } from '../users/users.factory'

export const tokenValidation = (req, res, next) => {
  if (req.path === '/api/login') {
    return next()
  }

  const token = req.headers.authorization.split(' ')[1]
  if (!token) {
    return res.status(401).send('Unauthorized')
  }

  jwt.verify(
    token,
    process.env.SECRET_KEY,
    async (error, decoded: { id: string }) => {
      if (error) {
        return res.status(401).send('Unauthorized')
      }

      try {
        const service = usersFactory.chooseUserService()
        const decodedUser = await service.getOneById(decoded.id)
        req.user = decodedUser
        return next()
      } catch (error) {
        return res.status(401).send('Unauthorized')
      }
    }
  )
}
