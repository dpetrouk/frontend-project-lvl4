import filter from 'leo-profanity';

const initProfanityFilter = () => {
  filter.add(filter.getDictionary('ru'));
  filter.add(filter.getDictionary('en'));
};

export { initProfanityFilter, filter as profanityFilter };
