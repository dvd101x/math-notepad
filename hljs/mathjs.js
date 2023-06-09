function mathjs(hljs) {
  function either(args) {
    return '(' + args.join('|') + ')';
  }

  function keywords(args) {
    return '\\b' + either(args) + '\\b';
  }

  const OPERATORS = {
    scope: 'punctuation',
    begin: /[=+\-*/.^?!%'<>:~]+/,
  };

  const OPERATOR_KEYWORDS = {
    scope: 'punctuation',
    begin: keywords(['to', 'in', 'and', 'not', 'or', 'xor', 'mod']),
  };

  const NUMBER_KEYWORDS = {
    scope: 'number',
    begin: keywords(['true', 'false', 'end']),
  };

  const UNIT_LIST = Object.keys(math.Unit.UNITS).sort((a, b) => b.length - a.length);

  const PREFIXED_UNIT_LIST = UNIT_LIST.map(e => {
      const prefixes = Object.keys(math.Unit.UNITS[e].prefixes).filter(e => e);
      const prefix_re = prefixes.length ? either(prefixes) + '?' : '';
      return prefix_re + e;
  });

  const UNITS = {
    scope: 'class',
    begin: keywords(PREFIXED_UNIT_LIST),
  };

  const MATRIX = {
    scope: 'bullet',
    begin: /[\[\],;]/,
  };

  const FUNCTION_LIST = Object.getOwnPropertyNames(math)
    .filter(e => typeof math[e] === "function")
    .filter(
      e => {
        try {
          return typeof math.evaluate(e) === "function" ? true : false
        } catch {
          return false
        }
      }
    );

  const FUNCTIONS = {
    scope: 'title',
    begin: keywords(FUNCTION_LIST),
  };

  const VARIABLE = {
    scope: 'variable',
    begin: /[a-zA-Z_$][a-zA-Z0-9_$]*/,
  };

  return {
    name: 'mathjs',
    contains: [
      hljs.HASH_COMMENT_MODE,
      hljs.C_NUMBER_MODE,
      NUMBER_KEYWORDS,
      OPERATORS,
      OPERATOR_KEYWORDS,
      UNITS,
      MATRIX,
      FUNCTIONS,
      VARIABLE,
    ],
  };
}

hljs.registerLanguage('mathjs', mathjs);
