
"""End-to-end browser test: register, login and open evaluation."""

import os
import uuid

import pytest
from playwright.sync_api import sync_playwright


pytestmark = pytest.mark.skipif(
    not os.getenv("E2E_BASE_URL"),
    reason="E2E_BASE_URL is not configured",
)


def test_register_login_and_open_evaluation_page():
    base_url = os.environ["E2E_BASE_URL"]

    email = f"e2e-{uuid.uuid4().hex[:10]}@example.com"
    password = "E2E-Strong-Password-123!"

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        api_responses = []

        page.on(
            "response",
            lambda response: api_responses.append(
                f"{response.status} {response.url}"
            )
            if "/api/" in response.url
            else None,
        )

        try:
            # 1. Open application
            page.goto(base_url, wait_until="networkidle")

            # 2. Open registration
            page.get_by_role(
                "button", name="Create a new account"
            ).click()

            # 3. Fill registration form
            page.get_by_placeholder(
                "Enter your full name"
            ).fill("E2E Analyst")

            page.get_by_placeholder(
                "Enter your email"
            ).fill(email)

            page.get_by_placeholder(
                "At least 12 characters"
            ).fill(password)

            # 4. Register
            page.get_by_role(
                "button", name="Create account"
            ).click()

            page.get_by_text(
                "Account created successfully!",
                exact=False,
            ).wait_for(timeout=20000)

            # Registration returns to sign-in screen.
            page.get_by_text(
                "Welcome back",
                exact=True,
            ).wait_for(timeout=10000)

            # 5. Sign in with the newly created account
            page.get_by_placeholder(
                "Enter your email"
            ).fill(email)

            page.get_by_placeholder(
                "Enter your password"
            ).fill(password)

            page.get_by_role(
                "button", name="Sign in"
            ).click()

            # 6. Verify authenticated session
            page.get_by_role(
                "button",
                
                name="Log out",
            ).wait_for(timeout=20000)
            print("\nSUCCESS: Registration and login verified.")
            print("Test account:", email)

            # 7. Open Evaluation if available
            evaluation_link = page.get_by_text(
                "Evaluation & Benchmarking",
                exact=True,
            )

            evaluation_link.wait_for(timeout=20000)
            evaluation_link.click()

            page.get_by_text(
                "SDLC readiness index",
                exact=True,
            ).wait_for(timeout=20000)

            page.get_by_text(
                "Evaluation metrics",
                exact=False,
            ).wait_for(timeout=20000)

            print("SUCCESS: Evaluation page verified.")

        except Exception:
            print("\n========== E2E FAILURE DETAILS ==========")
            print("URL:", page.url)
            print(page.locator("body").inner_text()[:5000])

            print("\n========== API RESPONSES ==========")
            for response in api_responses:
                print(response)

            raise

        finally:
            browser.close()
