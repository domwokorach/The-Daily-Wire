import { render, screen } from "@testing-library/react";

function Hello() {
  return <div>Hello, Jest</div>;
}

test("renders without crashing", () => {
  render(<Hello />);
  expect(screen.getByText("Hello, Jest")).toBeInTheDocument();
});
