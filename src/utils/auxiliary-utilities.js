const getRandomInt = (a = 0, b = 1) => Math.floor(Math.random() * (Math.floor(Math.max(a, b)) - Math.ceil(Math.min(a, b)) + 1)) + Math.ceil(Math.min(a, b));

const getRandomElement = (elements) => elements[getRandomInt(0, elements.length - 1)];

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);
  return index === -1 ? items : [...items.slice(0, index), update, ...items.slice(index + 1)];
};

const doUppercaseString = (string) => string[0].toUpperCase() + string.slice(1);

export { getRandomInt, updateItem, getRandomElement, doUppercaseString };
