function Canview(user) {
    return (
        user.role === "SUP" 
    )
}
module.exports = {
    Canview
}