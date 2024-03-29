import React from "react"
import "@testing-library/jest-dom/extend-expect"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Togglable from "./Togglabble"

describe("<Togglable />", () => {
  let container

  // 运行每个 test 之前都会执行一次 beforeEach
  beforeEach(() => {
    container = render(
      <Togglable buttonLabel="show...">
        <div className="testDiv" >
          togglable content
        </div>
      </Togglable>
    ).container
  })

  test("renders its children", () => {
    screen.findAllByText("togglable content")
  })

  test("at start the children are not displayed", () => {
    const div = container.querySelector(".togglableContent")
    expect(div).toHaveStyle("display: none")
  })

  test("after clicking the button, children are displayed", () => {
    const button = screen.getByText("show...")
    userEvent.click(button)

    const div = container.querySelector(".togglableContent")
    expect(div).not.toHaveStyle("display: none")
  })
})