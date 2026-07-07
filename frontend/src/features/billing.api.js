export const createOrder = async (plan) => {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  return {
    order: {
      id: "ord_" + Math.random().toString(36).substr(2, 9),
      amount: plan.price * 100, // in paise
      currency: "INR"
    },
    plan: {
      name: plan.name,
      price: plan.price
    }
  };
};
