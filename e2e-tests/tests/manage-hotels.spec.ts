// need to sign in as a user
import { test, expect} from "@playwright/test"
import path from "path"

const UI_URL = "http://localhost:5173"

test.beforeEach(async({ page })=>{
    await page.goto(UI_URL);

  // get the sign in button
  await page.getByRole("link", { name: "Sign In"}).click();
  // check to make sure that the sign in text is there
  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();
  //add an email and password
  await page.locator("[name=email]").fill("ak1@gmail.com");
  await page.locator("[name=password]").fill("password123");
  // click login button
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByText("Sign in Successful")).toBeVisible()
})

test("should allow user to add a hotel", async({ page }) => {
    await page.goto(`${UI_URL}/add-hotel`);
    await page.locator('[name="name"]').fill("Test Hotel");
    await page.locator('[name="city"]').fill("new city");
    await page.locator('[name="country"]').fill("new country");
    await page.locator('[name="description"]').fill("This is a description for the Test Hotel");
    await page.locator('[name="pricePerNight"]').fill("100");
    await page.selectOption('select[name="starRating"]', "3");

    await page.getByText("Budget").click();
    await page.getByLabel("Free Wifi").check();
    await page.getByLabel("Parking").check();

    await page.locator('[name="adultCount"]').fill("2");
    await page.locator('[name="childCount"]').fill("2");

    // need to upload files for images
    await page.setInputFiles('[name="imageFiles"]', [
        path.join(__dirname, "files", "beach1.png"),
        path.join(__dirname, "files", "beach2.png"),
    ])

    await page.getByRole('button', { name: "Save" }).click()

    await expect(page.getByText("Hotel Saved")).toBeVisible();
})

test("should display hotels", async({ page })=> {
    await page.goto(`${UI_URL}/my-hotels`);

    await expect(page.getByText("Testing Hotel")).toBeVisible();
    await expect(page.getByText("Some short")).toBeVisible()
    await expect(page.getByText("dublin, us")).toBeVisible();
    await expect(page.getByText("Ski Resort")).toBeVisible();
    await expect(page.getByText("$99 per night")).toBeVisible();
    await expect(page.getByText("4 adults, 1 children")).toBeVisible();
    await expect(page.getByText("2 Star Rating")).toBeVisible();

    let viewDetailsButton = await page.getByText("View Details").nth(1)
    await expect(viewDetailsButton).toBeVisible()
    
    await expect(page.getByRole("link", { name: "Add Hotel"})).toBeVisible()
})