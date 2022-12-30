const puppeteer = require("puppeteer");

const codeObj = require("./codes");

const loginLink = "https://www.hackerrank.com/auth/login";
const email = "clenchw@gmail.com";
const password = "242526";


(async function () {
    try {
        const browserInstance = await puppeteer.launch({
            headless: false,

            args: ["--start-maximized"],

            defaultViewport: null
        });
        let newTab = await browserInstance.newPage();
        await newTab.goto(loginLink);
        await newTab.type("#input-1", email, { delay: 50 });
        await newTab.type("#input-2", password, { delay: 50 });
        await newTab.click("button[type='submit']", { delay: 50 });
        await waitAndClick('a[data-attr1="algorithms"]', newTab);
        await waitAndClick('input[value="warmup"]', newTab);
        let allChalleges = await newTab.$$('.ui-btn.ui-btn-normal.primary-cta.ui-btn-line-primary.ui-btn-styled', { delay: 50 });
        console.log(`Total Questioons :`, allChalleges.length);
        let questionWillBeSolved = await questionSolver(newTab, allChalleges[0], codeObj.answers[0]);
        return questionWillBeSolved;
    } catch (error) {
        console.log(error);
    }
})();


// Wait And Click
async function waitAndClick(selector, cPage) {
    await cPage.waitForSelector(selector);
    let selectorClicked = cPage.click(selector);
    return selectorClicked;
}

// Question Solver
async function questionSolver(page, question, answer) {
    await new Promise(async function (resolve, reject) {
        try {
            await question.click();
            await waitAndClick('.monaco-editor.no-user-select.vs', page);
            await waitAndClick('.checkbox-input', page);
            await page.waitForSelector('textarea.custominput', page);
            await page.type('textarea.custominput', answer, { delay: 10 });
            await page.keyboard.down('Control');
            await page.keyboard.press('A', { delay: 100 });
            await page.keyboard.press('X', { delay: 100 });
            await page.keyboard.up('Control');
            await waitAndClick('.monaco-editor.no-user-select.vs', page);
            await page.keyboard.down('Control');
            await page.keyboard.press('A', { delay: 100 });
            await page.keyboard.press('V', { delay: 100 });
            await page.keyboard.up('Control');
            await page.click('.hr-monaco__run-code', { delay: 50 });
            await page.click('.hr-monaco-submit', { delay: 100 });
            await resolve();
            await reject();
        } catch (error) {
            console.log(error)
        }
    });

}