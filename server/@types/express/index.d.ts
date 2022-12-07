declare module 'express-session' {
  // Declare that the session will potentially contain these additional fields
  export interface SessionData {
    journeyStartUrl: query
    returnTo: string
    nowInMinutes: number
    userDetails: {
      activeCaseLoadId: string
    }
    newMovePrisonerJourney: boolean
    newRemoveRestrictedPatientJourney: boolean
    newAddRestrictedPatientJourney: boolean
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
      id: string
    }
  }
}
