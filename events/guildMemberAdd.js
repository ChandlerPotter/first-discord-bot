module.exports = (client, newMember) => {
    newMember.send(`Welcome to ${newMember.guild.name}!`);
}