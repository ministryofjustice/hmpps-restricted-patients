// import 'reflect-metadata'
// import PrisonerSearchService, { PrisonerSearchSummary } from './prisonerSearchService'
// import PrisonerSearchClient from '../data/prisonerSearchClient'
// import PrisonApiClient from '../data/prisonApiClient'
// import HmppsAuthClient, { User } from '../data/hmppsAuthClient'

// const search = jest.fn()
// const getPrisonerImage = jest.fn()

// jest.mock('../data/hmppsAuthClient')
// jest.mock('../data/prisonerSearchClient', () => {
//   return jest.fn().mockImplementation(() => {
//     return { search }
//   })
// })

// jest.mock('../data/prisonApiClient', () => {
//   return jest.fn().mockImplementation(() => {
//     return { getPrisonerImage }
//   })
// })

// const hmppsAuthClient = new HmppsAuthClient(null) as jest.Mocked<HmppsAuthClient>

// const token = 'some token'
// const prisonIds = ['PR1', 'PR2']
// const user = {
//   username: 'user1',
//   name: 'User',
//   activeCaseLoadId: 'MDI',
//   token: 'token-1',
// } as User

// describe('prisonerSearchService', () => {
//   let service: PrisonerSearchService

//   beforeEach(() => {
//     hmppsAuthClient.getSystemClientToken.mockResolvedValue(token)

//     service = new PrisonerSearchService(hmppsAuthClient)
//   })

//   afterEach(() => {
//     jest.clearAllMocks()
//   })

//   describe('search', () => {
//     it('search by prisoner identifier', async () => {
//       search.mockResolvedValue([
//         {
//           alerts: [
//             { alertType: 'T', alertCode: 'TCPA' },
//             { alertType: 'X', alertCode: 'XCU' },
//           ],
//           firstName: 'JOHN',
//           lastName: 'SMITH',
//           prisonName: 'HMP Moorland',
//           prisonerNumber: 'A1234AA',
//         },
//       ])
//       const results = await service.search({ searchTerm: 'a1234aA', prisonIds }, user)
//       expect(results).toStrictEqual([
//         {
//           alerts: [
//             {
//               alertCode: 'TCPA',
//               alertType: 'T',
//             },
//             {
//               alertCode: 'XCU',
//               alertType: 'X',
//             },
//           ],
//           displayName: 'Smith, John',
//           formattedAlerts: [
//             {
//               alertCodes: ['XCU'],
//               classes: 'alert-status alert-status--controlled-unlock',
//               label: 'Controlled unlock',
//             },
//           ],
//           firstName: 'JOHN',
//           lastName: 'SMITH',
//           prisonerNumber: 'A1234AA',
//           prisonName: 'HMP Moorland',
//         } as PrisonerSearchSummary,
//       ])
//       expect(PrisonerSearchClient).toBeCalledWith(user.token)
//       expect(search).toBeCalledWith({ prisonerIdentifier: 'A1234AA', prisonIds })
//     })

//     it('search by prisoner name', async () => {
//       search.mockResolvedValue([
//         {
//           firstName: 'JOHN',
//           lastName: 'SMITH',
//           prisonName: 'HMP Moorland',
//           prisonerNumber: 'A1234AA',
//         },
//       ])
//       const results = await service.search({ searchTerm: 'Smith, John', prisonIds }, user)
//       expect(results).toStrictEqual([
//         {
//           displayName: 'Smith, John',
//           formattedAlerts: [],
//           firstName: 'JOHN',
//           lastName: 'SMITH',
//           prisonerNumber: 'A1234AA',
//           prisonName: 'HMP Moorland',
//         } as PrisonerSearchSummary,
//       ])
//       expect(PrisonerSearchClient).toBeCalledWith(user.token)
//       expect(search).toBeCalledWith({ lastName: 'Smith', firstName: 'John', prisonIds })
//     })

//     it('search by prisoner surname only', async () => {
//       await service.search({ searchTerm: 'Smith', prisonIds }, user)
//       expect(search).toBeCalledWith({ lastName: 'Smith', prisonIds })
//     })

//     it('search by prisoner name separated by a space', async () => {
//       await service.search({ searchTerm: 'Smith John', prisonIds }, user)
//       expect(search).toBeCalledWith({ lastName: 'Smith', firstName: 'John', prisonIds })
//     })

//     it('search by prisoner name separated by many spaces', async () => {
//       await service.search({ searchTerm: '    Smith   John ', prisonIds }, user)
//       expect(search).toBeCalledWith({ lastName: 'Smith', firstName: 'John', prisonIds })
//     })

//     it('search by prisoner identifier with extra spaces', async () => {
//       await service.search({ searchTerm: '    A1234AA ', prisonIds }, user)
//       expect(search).toBeCalledWith({ prisonerIdentifier: 'A1234AA', prisonIds })
//     })
//   })

//   describe('getPrisonerImage', () => {
//     it('uses prison api to request image data', async () => {
//       getPrisonerImage.mockResolvedValue('image data')

//       const results = await service.getPrisonerImage('A1234AA', {
//         activeCaseLoadId: 'MDI',
//         name: 'User',
//         username: 'user1',
//         token: 'token-1',
//       })

//       expect(results).toEqual('image data')
//       expect(PrisonApiClient).toBeCalledWith(token)
//       expect(getPrisonerImage).toBeCalledWith('A1234AA')
//     })
//   })
// })
