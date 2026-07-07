const MSG_PREFIX = 'syncagents_messages_';

export const getMessages = async (conversationId) => {
  const data = localStorage.getItem(MSG_PREFIX + conversationId);
  return data ? JSON.parse(data) : [];
};
