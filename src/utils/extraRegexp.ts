export default {
  type: (val: any): val is number => {
    return /[01]/.test(val);
  },
};
