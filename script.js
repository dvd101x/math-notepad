const wait = 300;

const example = [
  "# # Quadratic Formula",
  "# ",
  "# In algebra, a quadratic equation is any equation that can be rearranged in standard form as",
  "# ",
  "# $$ ax^{2}+bx+c=0 $$",
  "# ",
  "# The quadratic formula is",
  "# ",
  "# $$ x=\\frac {-b \\pm \\sqrt {b^{2}-4ac}}{2a} $$",
  "",
  "a = 1;",
  "b = 5;",
  "c = 3;",
  "x = (-b + [1,-1] sqrt(b^2-4 a c)) / (2 a);",
  "print('With a = $a, b=$b, and c=$c', {a:a, b:b, c:c})",
  "print('x has two solutions $0 and $1', x, 4) ",
  "",
  "# ## Proof",
  "",
  "proof = a x.^2 + b x + c;",
  "print('Using x = $0 we get $1', [x[1], proof[1]], 4)",
  "print('Using x = $0 we get $1', [x[2], proof[2]], 4)",
]

const intro = example.join('\n');

const parser = math.parser()

function math2str(x) {
  return typeof x == "string" ? x : math.format(x, 14)
}

function evalCell(cell) {
  let mathResult
  try {
    mathResult = parser.evaluate(cell)
  } catch (error) {
    return error.toString()
  }
  if (typeof mathResult != 'undefined') {
    if (mathResult.entries) {
      return mathResult.entries
        .filter(x => typeof x != 'undefined')
        .map(x => math2str(x)).join("\n")
    }
    else {
      return math2str(mathResult)
    }
  }
}

const md = markdownit({ html: true })
  .use(texmath, {
    engine: katex,
    delimiters: ['dollars', 'beg_end'],
    katexOptions: { macros: { "\\RR": "\\mathbb{R}" } }
  })

function makeDoc(code) {
  const splitCode = code.split('\n');
  const lineTypes = splitCode.map(line => line.startsWith('# ') ? 'md' : 'math');
  let cells = [];
  let lastType = '';
  splitCode
    .forEach((line, lineNum) => {
      if (lastType === lineTypes[lineNum]) {
        cells[cells.length - 1].source.push(line)
      }
      else {
        cells.push({ cell_type: lineTypes[lineNum], source: [line] })
      }
      lastType = lineTypes[lineNum]
    })
  let cleanCells = []
  cells.forEach(x => {
    if (x.cell_type === 'md') {
      cleanCells.push({ cell_type: 'md', source: x.source.map(e => e.slice(2)) })
    }
    else {
      let notEmptyMath = x.source.filter(e => e)
      if (notEmptyMath.length) {
        cleanCells.push({ cell_type: 'math', source: notEmptyMath })
      }
    }
  })

  let output = [];

  const processOutput = {
    math: mathCell => {
      let result = evalCell(mathCell.join('\n'))
      return result.length ? '<pre>' + result + '</pre>' : ''
    },
    md: markdown => md.render(markdown.join('\n'))
  }

  cleanCells.forEach(
    cell => output.push(processOutput[cell.cell_type](cell.source))
  )
  return output.join('\n')
}

function doMath(input) {
  document.getElementById('output').innerHTML = makeDoc(input)
}

function dropHandler(ev) {
  ev.preventDefault();

  const file = ev.dataTransfer.items[0].getAsFile();
  file.text().then(e => editor.updateCode(e));
}

async function start(url) {
  let code = intro;
  if (url) code = await (await fetch(url)).text();
  editor.updateCode(code);
  doMath(editor.toString());
}

var timer;

editor.onUpdate(code => {
  clearTimeout(timer);
  timer = setTimeout(doMath, wait, code);
});

hljs.configure({ ignoreUnescapedHTML: true });

const params = new URLSearchParams(window.location.search);
start(params.get('input'));
