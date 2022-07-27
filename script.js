const wait = 100;

const intro = '# Type math.js expressions here, like 2 + 2, det([1, 2; 3, 4]), 3600 J to Wh, or help("det")\n\n\n';

function showDoc(doc) {
  if (!doc) {
    help.style.display = 'none';
    return;
  }

  help_name.textContent = doc.name;
  help_description.textContent = doc.description;
  help_syntax_code.textContent = doc.syntax?.join("\n");
  hljs.highlightElement(help_syntax_code);
  help_examples_code.textContent = doc.examples?.join("\n");
  hljs.highlightElement(help_examples_code);
  help_seealso_text.textContent = doc.seealso?.join(", ");
  help.style.display = 'block';
}

function doMath(input) {
  let output = [];
  let scope = {};
  let doc;

  for (const line of input.split('\n')) {
    let output_line = '';
    if (line) {
      if (line.startsWith('#')) {
        output_line = '#';
      } else {
        try {
          const r = math.evaluate(line, scope);
          if (r) {
            if (r.doc) doc = r.doc;
            else output_line = math.format(r, 14);
          }
        } catch(e) {
          output_line = e.toString();
        }
      }
    }
    output.push(output_line);
  }

  results.updateCode(output.join('\n'));
  showDoc(doc);
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
