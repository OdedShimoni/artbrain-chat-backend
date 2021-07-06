const gqlRequest = require("graphql-request").request;

const getMessagesOf = async (ip) => {
    const gqlQuery = `query {
        messageMany(filter: {
        visitor_ip: "${ip}"
        }) {
        _id,
        visitor_ip,
        sent_by_support,
        text
        }
    }`;

    const response = await gqlRequest(process.env.MESSAGES_SERVER_URI, gqlQuery);
    return response.messageMany;
}

module.exports = getMessagesOf;