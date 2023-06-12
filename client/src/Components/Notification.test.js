import React from "react"
import "@testing-library/jest-dom/extend-expect"
import { render, screen } from "@testing-library/react"
import Notification from "./Notification"

describe("<Notification />", () => {
  test("Nothing happened", () => {
    const msg = null
    const container = render(<Notification message={msg}/>).container
    const div = container.querySelector(".error")
    expect(div).toBeNull()
  })


  test("renders a message", () => {
    const msg = "Nothing happened"
    render(<Notification message={msg} />)
    const div = screen.findByText("Nothing happened")
    expect(div).toBeDefined()
  })
})