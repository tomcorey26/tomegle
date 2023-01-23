import { faker } from '@faker-js/faker'
// create a function that returns a fake user, with an optional parameter to override any of the default values

export const fakeUser = (overrides?: Partial<User>): User => ({
  id: crypto.randomUUID(),
  name: faker.name.fullName(),
  username: faker.internet.userName(),
  avatar: faker.internet.avatar(),
  email: faker.internet.email(),
  ...overrides
})
