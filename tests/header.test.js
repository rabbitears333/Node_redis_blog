// const puppeteer = require('puppeteer');
const sessionFactory = require('./factories/sessionFactory');
const userFactory = require('./factories/userFactory');
const { Page } = require('./helpers/page');

// let browser, page;
let page;
beforeEach (async () => {
    page = await Page.build();
    await page.goto('http://localhost:3000');
});

afterEach(async () => {
    await page.close();
}); 

test(
    'add two numbers', () => {
        const sum = 1 + 2;
        expect(sum).toEqual(3);
    });

test('assert header has correct test', async() => {
    const textn = await page.getContentsOf('a.brand-logo');
    expect(textn).toEqual('Blogster');
});

// test('assert click login starts oauth', async() => {
//     jest.setTimeout(30000);
//     await page.click('.right a');

//     const url = page.url();
// });

test.only('When user is signed into google, test shows auth flow', async() => {
    // const id = '5ba04bce179b3d126ca7ac75';
    await page.login();
    const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);
    expect(text).toEqual('Logout');
}); 



// test();