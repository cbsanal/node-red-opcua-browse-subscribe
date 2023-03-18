const delay = async (time) => {
  await new Promise((resolve) => setTimeout(resolve, time));
};

module.exports = {
  delay,
};
