const { Page } = require('./helpers/page');
let page;
beforeEach (async () => {
    page = await Page.build();
    await page.goto('http://localhost:3000');
});

afterEach (async () => {
    await page.close();
});



describe('when logged into the page', async () => {
    beforeEach(async () => {
        await page.login();
        await page.click('a.btn-floating');
    });

    test('then user is able to view form. ', async () => {
     
        const label = await page.getContentsOf('form label');
        expect(label).toEqual('Blog Title');
    });
});

describe('when logged into page with invalid inputs', async () => {
    beforeEach(async () => {
        await page.click('form button');
    });
    test('then user observes error message', async () => {
        const titleError = await page.getContentsOf('.title .red-text');
        const contentError = await page.getContentsOf('.content .red-text');
        expect(titleError).toEqual('You must provide a value');
        expect(contentError).toEqual('You must provide a value');
    });
});

describe('when user is not logged into page', async () => {
    test('then user cannot create blog post', async () => {
        const result = await page.evaluate(
            () => {
                return fetch('/api/blogs', {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({title: 'my title', content: 'my content'})
                }).then(res.JSON());
            }
        );
        expect(result).toEqual({error: 'You must log in'});
    });
    test('then user cannot invoke list of blog posts', async () => {
        const result = await page.evaluate(
            () => {
                return fetch('/api/blogs', {
                    method: 'GET',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(res.JSON());
            }
        );
        expect(result).toEqual({error: 'You must log in'});
    });
});

describe('when logged into page with valid inputs', async () => {
    beforeEach(async () => {
        await page.type('.title input', 'My title');
        await page.type('.content input', 'My Content');
        await page.click('form button');
    });
    test('then user moves to review screen', async () => {
        const text = await page.getContentsOf('h5');
        expect(text).toEqual('Please confirm entries.');
    });
    test('then user clicks on save button to index page', async () => {
        await page.click('button.green');
        await page.waitFor('.card');
        const title = await page.getContentsOf('.card-title');
        const content = await page.getContentsOf('p');
        expect(title).toEqual('My Title');
        expect(content).toEqual('My Content');
    });
});