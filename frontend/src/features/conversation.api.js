const CONV_KEY = 'syncagents_conversations';

export const getConversations = async () => {
  const data = localStorage.getItem(CONV_KEY);
  return data ? JSON.parse(data) : [];
};

export const createConversation = async () => {
  const conversations = await getConversations();
  const newConv = {
    _id: Math.random().toString(36).substr(2, 9),
    title: 'New Chat',
    createdAt: new Date().toISOString(),
  };
  conversations.unshift(newConv);
  localStorage.setItem(CONV_KEY, JSON.stringify(conversations));
  return newConv;
};

export const updateConversations = async (id, title) => {
  const conversations = await getConversations();
  const index = conversations.findIndex((c) => c._id === id);
  if (index !== -1) {
    conversations[index].title = title;
    localStorage.setItem(CONV_KEY, JSON.stringify(conversations));
  }
  return conversations[index];
};
