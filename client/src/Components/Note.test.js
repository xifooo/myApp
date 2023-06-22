import React from "react"
import "@testing-library/jest-dom/extend-expect"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Note from "./Note"


describe("<Note /> renders content and clicks importance's button", () => {
  test("renders content", () => {
    const note = {
      content: "Component testing is done with react-testing-library",
      important: true
    }
    const mockFunc = jest.fn()

    render(<Note note={note} toggleImportance={mockFunc}/>)

    const element = screen.getByText("Component testing is done with react-testing-library")
    expect(element).toBeDefined()  // 若 getByText 未找到元素，则测试失败
  })


  test("clicking the button calls event handler once", () => {
    const note = {
      content: "Component testing is done with react-testing-library",
      important: true
    }
    const mockHandler = jest.fn()

    render(<Note note={note} toggleImportance={mockHandler} />)

    // const button = screen.getByText("make not important")
    const buttons = screen.getAllByRole("button")

    userEvent.click(buttons[0])
    expect(mockHandler.mock.calls).toHaveLength(1)
  })

})