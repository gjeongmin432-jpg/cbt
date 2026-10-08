const fs = require('fs');
const path = require('path');

function parseAll() {
  const baseDir = path.resolve(__dirname, '..');
  const qPath = path.join(baseDir, '실기 문제.txt');
  const aPath = path.join(baseDir, '실기 해설.txt');
  const outPath = path.join(baseDir, 'src', 'data', 'questions.json');

  const qRaw = fs.readFileSync(qPath, 'utf8');
  const aRaw = fs.readFileSync(aPath, 'utf8');

  // Find round positions
  const roundRegex = /\[제(\d+)회 모의고사\]/g;
  
  const getRoundBlocks = (rawText) => {
    const blocks = {};
    let matches = [];
    let match;
    while ((match = roundRegex.exec(rawText)) !== null) {
      matches.push({ round: parseInt(match[1], 10), index: match.index, end: match.index + match[0].length });
    }
    for (let i = 0; i < matches.length; i++) {
      const start = matches[i].end;
      const end = i + 1 < matches.length ? matches[i + 1].index : rawText.length;
      blocks[matches[i].round] = rawText.slice(start, end);
    }
    return blocks;
  };

  const qRounds = getRoundBlocks(qRaw);
  const aRounds = getRoundBlocks(aRaw);

  const allQuestions = [];

  for (let r = 1; r <= 10; r++) {
    const qText = qRounds[r] || '';
    const aText = aRounds[r] || '';

    // Match questions
    const qItemRegex = /【문\s*(\d+)】([^\n]*)/g;
    const aItemRegex = /【문\s*(\d+)】\s*정답/g;

    const qItems = [];
    let qm;
    while ((qm = qItemRegex.exec(qText)) !== null) {
      qItems.push({ num: parseInt(qm[1], 10), rawType: qm[2].trim(), index: qm.index, bodyStart: qm.index + qm[0].length });
    }

    const aItems = [];
    let am;
    while ((am = aItemRegex.exec(aText)) !== null) {
      aItems.push({ num: parseInt(am[1], 10), index: am.index, bodyStart: am.index + am[0].length });
    }

    const qMap = {};
    for (let i = 0; i < qItems.length; i++) {
      const item = qItems[i];
      const end = i + 1 < qItems.length ? qItems[i + 1].index : qText.length;
      let body = qText.slice(item.bodyStart, end);
      body = body.replace(/\[과목\s*\d+:[^\]]+\]/g, '').replace(/=+/g, '').trim();

      const typeMatch = item.rawType.match(/\((.*?)\)/);
      const qType = typeMatch ? typeMatch[1].trim() : (item.rawType || '단답형');

      qMap[item.num] = {
        type: qType,
        question: body
      };
    }

    const aMap = {};
    for (let i = 0; i < aItems.length; i++) {
      const item = aItems[i];
      const end = i + 1 < aItems.length ? aItems[i + 1].index : aText.length;
      let block = aText.slice(item.bodyStart, end);
      block = block.replace(/\[과목\s*\d+:[^\]]+\]/g, '').replace(/=+/g, '').trim();

      const explIndex = block.indexOf('[해설]');
      let modelAns = '';
      let expl = '';
      if (explIndex !== -1) {
        modelAns = block.slice(0, explIndex).trim();
        expl = block.slice(explIndex + 4).trim();
      } else {
        modelAns = block.trim();
        expl = '';
      }

      aMap[item.num] = {
        modelAnswer: modelAns,
        explanation: expl
      };
    }

    for (let q = 1; q <= 20; q++) {
      const category = q <= 7 ? '화재예방과 소화방법' : '위험물안전관리법';
      const qInfo = qMap[q] || { type: '단답형', question: '' };
      const aInfo = aMap[q] || { modelAnswer: '', explanation: '' };

      allQuestions.push({
        id: `${r}-${q}`,
        round: r,
        number: q,
        category,
        type: qInfo.type,
        question: qInfo.question,
        modelAnswer: aInfo.modelAnswer,
        explanation: aInfo.explanation
      });
    }
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(allQuestions, null, 2), 'utf8');
  console.log(`Successfully parsed ${allQuestions.length} questions into ${outPath}`);
}

parseAll();
