from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    page.goto("http://localhost:3000")
    page.screenshot(path="jules-scratch/verification/01-initial-page.png")
    page.get_by_role("tab", name="Drag & Drop").click()
    page.screenshot(path="jules-scratch/verification/02-dnd-page.png")
    page.get_by_label("Toggle dark mode").click()
    page.screenshot(path="jules-scratch/verification/03-dark-mode.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)