import { faker } from '@faker-js/faker'
// TODO
// 1. Watch the video on how to model SQL tables
// 2. Figure out how to model the user, message, and conversation tables
// 3. Figure out how to model the relationship between the user, message, and conversation tables
// 4. Create the fakes for the user, message, and conversation tables
// 5. Implement the UI for the conversation page

// create a function that creates a fake message and takes an optional object
// with overrides as the argument
export const fakeMessage = (overrides?: Partial<ChatMessage>) => {
  // create a fake message
  const message: ChatMessage = {
    // generate a random id using native javascript
    id: crypto.randomUUID(),
    text: faker.lorem.sentence(),
    date: faker.date.past().toISOString(),
    sender: faker.name.firstName(),
    ...overrides
  }

  // return the fake message
  return message
}
