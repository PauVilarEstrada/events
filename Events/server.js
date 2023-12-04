const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const users = [
    { username: 'Lin', password: 'Lineseladmin' },
    { username: 'Pau', password: 'Paueseluser' }
];

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        res.json({ message: 'Login successful' });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

app.post('/logout', (req, res) => {
    const { username } = req.body;

    authenticatedUsers = authenticatedUsers.filter(u => u.username !== username);

    res.json({ message: 'Logout successful' });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
