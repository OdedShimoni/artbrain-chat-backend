const gqlRequest = require("graphql-request").request;

class MessagesAPI {
    getAll = async () => {
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

    getAllOf = async (ip) => {
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

    save = async (message) => {
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
}

module.exports = MessagesAPI;