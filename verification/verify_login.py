from playwright.sync_api import Page, expect, sync_playwright

def verify_login_page(page: Page):
  # 1. Arrange: Go to the Login page.
  page.goto("http://localhost:5173/login")

  # 2. Assert: Check if the Login form is visible.
  expect(page.get_by_role("heading", name="Login")).to_be_visible()
  expect(page.get_by_label("Email")).to_be_visible()
  expect(page.get_by_label("Password")).to_be_visible()
  expect(page.get_by_role("button", name="Login")).to_be_visible()

  # 3. Screenshot: Capture the login page.
  page.screenshot(path="verification/login_page.png")

if __name__ == "__main__":
  with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    try:
      verify_login_page(page)
    finally:
      browser.close()
