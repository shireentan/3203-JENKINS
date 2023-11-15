const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');

const app = express();
const port = 8081;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Load the common password list
const commonPasswords = fs.readFileSync('10-million-password-list-top-10000.txt', 'utf-8').split('\n');

// Homepage route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Login page route
app.post('/login', (req, res) => {
    const password = req.body.password;

    // Password validation based on OWASP Top 10 Proactive Controls
    if (isPasswordSecure(password)) {
        req.session.loggedin = true;
        req.session.password = password;
        res.redirect('/welcome');
    } else {
        res.redirect('/');
    }
});

// Welcome page route
app.get('/welcome', (req, res) => {
    if (req.session.loggedin) {
        const password = req.session.password;
        res.send(`
            <h1>Welcome</h1>
            <p>Entered Password: ${password}</p>
            <form action="/logout" method="post">
                <button type="submit">Logout</button>
            </form>
        `);
    } else {
        res.redirect('/');
    }
});

// Logout route
app.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Function to check if the password is secure
function isPasswordSecure(password) {
    // Password validation based on OWASP Top 10 Proactive Controls
    if (password.length < 8) {
        console.log('Password does not meet length requirements.');
        return false;
    }

    // Check for complexity: Require at least one uppercase letter, one lowercase letter, one digit, and one special character
    if (
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password) ||
        !/[0-9]/.test(password) ||
        !/[!@#$%^&*(),.?":{}|<>]/.test(password)
    ) {
        console.log('Password does not meet complexity requirements.');
        return false;
    }

    // Block common passwords
    if (commonPasswords.includes(password)) {
        console.log('Password is common and not allowed.');
        return false;
    }

    return true;
}
