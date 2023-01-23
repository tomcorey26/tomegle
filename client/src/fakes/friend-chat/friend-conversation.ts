import { faker } from '@faker-js/faker'
import { fakeUser } from 'fakes/user'
import { fakeMessage } from 'fakes/friend-chat/message'

export const fakeFriendConversation = (
  overrides?: Partial<FriendConversation>
): FriendConversation => ({
  ...fakeUser(),
  unread: faker.datatype.boolean(),
  latestMessage: {
    text: faker.random.words(),
    time: faker.date.past().toISOString()
  },
  messages: Array.from({ length: 10 }, () => fakeMessage()),
  ...overrides
})
