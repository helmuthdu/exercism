export default class Forth {
  constructor() {
    this.operators = {
      '+': values => values.reduce((acc, val) => acc + val, values.shift()),
      '-': values => values.reduce((acc, val) => acc - val, values.shift()),
      '*': values => values.reduce((acc, val) => acc * val, values.shift()),
      '/': values => values.reduce((acc, val) => Math.floor(acc / val), values.shift()),
      dup: values => [...values, values[values.length - 1]],
      over: values => [...values, values[values.length - 2]],
      drop: values => values.splice(0, values.length - 1),
      swap: values => [...values.splice(0, values.length - 2), values[values.length - 1], values[values.length - 2]],
    };
    this.custom_operators = {};
  }

  evaluate(values) {
    this.values = values
      .split(' ')
      .map(n => (isNaN(n) ? n.toLowerCase() : Number(n)))
      .reduce((acc, val, index) => {
        if (!isNaN(val)) {
          acc.push(val);
        } else if ((val === 'drop' || val === 'dup') && acc.length > 0) {
          acc = this.operators[val](acc);
        } else if ((val === 'over' || val === 'swap') && acc.length > 1) {
          acc = this.operators[val](acc);
        } else if (/^:.*;$/.test(values)) {
          const [_, k, v] = values.match(new RegExp(`:\\s(\\S.*?)\\s(\\S.*)\\s;`));
          if (!isNaN(k)) throw new Error('Invalid definition');
          this.custom_operators[k.toLowerCase()] = v.split(' ').map(n => (isNaN(n) ? n.toLowerCase() : Number(n)));
        } else if (!this.operators[val] && !this.custom_operators[val]) {
          throw new Error('Unknown command');
        } else if (isNaN(val) && acc.length < 2 && !this.custom_operators[val]) {
          throw new Error('Stack empty');
        } else if (val === '/' && acc[index - 1] === 0) {
          throw new Error('Division by zero');
        } else {
          acc.push(val);
        }
        return acc;
      }, []);
  }

  get stack() {
    return this.values.reduce((acc, val) => {
      if (this.custom_operators[val]) {
        return this.custom_operators[val].reduce((a, v) => {
          if (!isNaN(v)) return [...a, v];
          const total = this.operators[v](a);
          return Array.isArray(total) ? total : [total];
        }, acc);
      }
      return isNaN(val) ? [this.operators[val](acc)] : [...acc, val];
    }, []);
  }
}
