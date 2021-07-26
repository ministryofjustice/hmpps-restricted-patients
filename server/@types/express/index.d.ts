declare module 'express-session' {
  // Declare that the session will potentially contain these additional fields
  export interface SessionData {
    returnTo: string
    nowInMinutes: number
    userDetails: {
      activeCaseLoadId: string
    }
  }
}

export declare global {
  namespace Express {
    interface User {
      username: string
      token: string
      authSource: string
    }

    interface Request {
      verified?: boolean
    }
  }
}
