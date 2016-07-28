module.exports = {
    'Login to the app': (browser) => {
        browser
            .url('http://localhost:8000/tasks')
            .waitForElementVisible('body', 1000)
            .setValue('input[type=email]', 'admin@admin')
            .setValue('input[type=password]', '123')
            .pause(5000)
            .end();
    },
};
