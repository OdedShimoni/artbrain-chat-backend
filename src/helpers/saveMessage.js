const gqlRequest = require("graphql-request").request;

const saveMessage = async (message) => {
    const gqlQuery = `mutation {
        messageCreateOne(
          record: {
            visitor_ip:"${message.ip}",
            text:"${message.text}",
            sent_by_support:${message.sentBySupport}
          }) {
              recordId: __typename
            }
      }`;

    const response = await gqlRequest(process.env.MESSAGES_SERVER_URI, gqlQuery);
    return response;
}

module.exports = saveMessage;