const gqlRequest = require("graphql-request").request;

const getAllMessages = async (ip) => {
    const gqlQuery = `query {
        messageMany {
        _id,
        visitor_ip,
        sent_by_support,
        text
        }
    }`;

    const response = await gqlRequest(process.env.MESSAGES_SERVER_URI, gqlQuery);
    return response.messageMany;
}

module.exports = getAllMessages;