import { expect, test } from 'vitest'
import { render } from 'vitest-browser-react'
import { App } from "../../src/App";

test('renders name', async () => {
  const { getByText } = await render(<App />)
  await expect.element(getByText('Hello Vitest!')).toBeInTheDocument()
})
