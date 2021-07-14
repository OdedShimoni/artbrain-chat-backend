const gqlRequest = require("graphql-request").request;
import { Message } from './common/types'

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

    getAllOf = async (ip: string) => {
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

    save = async (message: Message) => {
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

export default MessagesAPI;