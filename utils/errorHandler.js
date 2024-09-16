module.exports = (res, err) => {
    console.error(err);
    res.status(500).json({ error: 'An unexpected error occurred' });
};
