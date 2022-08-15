export const ERROR_MESSAGES = {
  ALREADY_CREATED: 'User already created',
  NO_MATCH_ID: 'No user with such ID',
  NO_MATCH_EMAIL: 'No user with such email',
  AUTHORIZATION_ERROR: 'Wrong login or password',
  NO_AUTHORIZE: 'Unauthorized',
  NO_MATCH_ROLE: 'Choose Admin or Customer',
  FORBIDDEN: 'No access',
}

export const errors = new Map()
  .set(ERROR_MESSAGES.ALREADY_CREATED, {
    message: 'User with this address already exists',
    status: 400,
  })
  .set(ERROR_MESSAGES.NO_MATCH_ID, {
    message: 'No user with such ID',
    status: 404,
  })
  .set(ERROR_MESSAGES.NO_MATCH_EMAIL, {
    message: 'No user with such email',
    status: 404,
  })
  .set(ERROR_MESSAGES.AUTHORIZATION_ERROR, {
    message: 'Wrong login or password',
    status: 401,
  })
  .set(ERROR_MESSAGES.NO_AUTHORIZE, {
    message: 'UNAUTHORIZED',
    status: 401,
  })
  .set(ERROR_MESSAGES.NO_MATCH_ROLE, {
    message: 'Choose Admin or Customer',
    status: 400,
  })
  .set(ERROR_MESSAGES.FORBIDDEN, {
    message: 'No access',
    status: 403,
  })

export const handleError = (res, error) => {
  const err = errors.get(error.message)
  if (err) {
    res.status(err.status).send(err.message)
  } else {
    res.status(500).send(error.message)
  }
}
