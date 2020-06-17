import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import { messagesQuery, addMessageMutation, messageAddedSubscription } from './graphql/queries'

export function useChatMessages() {
  const { data } = useQuery(messagesQuery);
  const messages = data ? data.messages : [];
  useSubscription(messageAddedSubscription, {
    onSubscriptionData: ({ client, subscriptionData }) => {
      // local state management
      client.writeData({
        data: {
          messages: messages.concat(subscriptionData.data.messageAdded)
        }
      });
    }
  });
  // const [addMessage, { loading, error, data, called }] = useMutation(addMessageMutation);
  const [addMessage] = useMutation(addMessageMutation);
  return {
    messages,
    addMessage: (text) => addMessage({ variables: { input: { text } } })
  }
}
