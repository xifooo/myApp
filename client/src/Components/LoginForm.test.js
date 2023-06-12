import React from "react"
import "@testing-library/jest-dom/extend-expect"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import LoginForm from "./LoginForm"

test("<LoginForm /> types an account info and calls onSubmit", () => {

  const eventHandler = jest.fn()

  render(<LoginForm handleUserLogin={eventHandler} />)

  // const inputUsername = screen.getByRole("textbox", { name: "Username" })
  // const inputPassword = screen.getByRole("textbox", { name: "Password" })
  const inputs = screen.getAllByRole("textbox")
  const sendButton = screen.getByRole("button")

  // userEvent.type(inputUsername, "UserForTesting")
  // userEvent.type(inputPassword, "123123")
  userEvent.type(inputs[0], "UserForTesting")
  userEvent.type(inputs[1], "123123")
  userEvent.click(sendButton)

  expect(eventHandler.mock.calls).toHaveLength(1)
  expect(eventHandler.mock.calls[0][0].content).toBe("UserForTesting")
  expect(eventHandler.mock.calls[0][1].content).toBe("123123")
})

// test("<LoginForm /> types an account info and calls onSubmit", async () => {
//   const eventHandler = jest.fn()
//   const user = userEvent.setup()
//   // 应该避免使用 container 查询元素：https://testing-library.com/docs/react-testing-library/api/#container-1
//   // 但是 container.querySelector确实很灵活
//   const { container } = render(<LoginForm handleUserLogin={eventHandler} />)

//   const inputUsername = screen.getByRole("textbox", { name: "Username" })
//   const inputPassword = screen.getByRole("textbox", { name: "Password" })

//   const sendButton = screen.getByRole("button")

//   await user.type(inputUsername, "UserForTesting")
//   await user.type(inputPassword, "123123")
//   await user.click(sendButton)

//   expect(eventHandler.mock.calls).toHaveLength(1)
//   expect(eventHandler.mock.calls[0][0].content).toBe("UserForTesting")
//   expect(eventHandler.mock.calls[0][1].content).toBe("123123")
// })

