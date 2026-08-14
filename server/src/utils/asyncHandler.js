// Wraps an async Express handler so rejected promises are forwarded to
// next(error) instead of crashing the process / hanging the request.
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

export function sendError(res, status, message) {
  return res.status(status).json({ error: { message } })
}
