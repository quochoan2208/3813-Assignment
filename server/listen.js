module.exports = function (http,PORT) {
    http.listen(PORT, () => {
        var d = new Date();
        var n = d.getHours();
        var m = d.getMinutes();
        console.log('CORS enabled Server has been started at : ' + n + ':' + m + ' on port ' + PORT);
    });
}
