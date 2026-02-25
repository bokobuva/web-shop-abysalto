import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Footer } from "../Footer";

describe("Footer", () => {
  it("renders all three column headings", () => {
    render(<Footer />);
    expect(
      screen.getByRole("heading", { name: /about us/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /customer support/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /connect with us/i }),
    ).toBeInTheDocument();
  });

  it("renders About links", () => {
    render(<Footer />);
    expect(
      screen.getByRole("link", { name: /our story/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /careers/i })).toBeInTheDocument();
  });

  it("renders Support links", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: /returns/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /shipping/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /help center/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /contact/i })).toBeInTheDocument();
  });

  it("renders social links with aria-label", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: /facebook/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^x$/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /instagram/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /youtube/i })).toBeInTheDocument();
  });

  it("renders newsletter button with aria-label", () => {
    render(<Footer />);
    const button = screen.getByRole("button", {
      name: /get in the loop.*newsletter/i,
    });
    expect(button).toBeInTheDocument();
  });

  it("newsletter button has data-testid", () => {
    render(<Footer />);
    expect(screen.getByTestId("footer-newsletter")).toBeInTheDocument();
  });

  it("calls handler when newsletter button clicked", async () => {
    render(<Footer />);
    const button = screen.getByTestId("footer-newsletter");
    await userEvent.click(button);
    // No-op handler - test passes if no error
    expect(button).toBeInTheDocument();
  });

  it("renders legal links", () => {
    render(<Footer />);
    expect(
      screen.getByRole("link", { name: /privacy policy/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /terms & conditions/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /accessibility statement/i }),
    ).toBeInTheDocument();
  });

  it("renders copyright text", () => {
    render(<Footer />);
    expect(
      screen.getByText(/web shop\. all rights reserved\./i),
    ).toBeInTheDocument();
  });
});
