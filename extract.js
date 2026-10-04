const fs = require('fs');
const path = require('path');

// ファイルパスの設定
const jsonPath = path.join(__dirname, 'public/works/works-size-added.json');
const outputPath = path.join(__dirname, 'descriptions.txt');

try {
  // 1. JSONファイルを読み込む
  const rawData = fs.readFileSync(jsonPath, 'utf8');
  
  // 2. パース（JSONオブジェクトに変換）する
  const data = JSON.parse(rawData);
  
  // 3. 各オブジェクトから description を取り出し、配列にする
  // description が存在しないオブジェクトがある場合を考慮して filter も挟んでいます
  const descriptions = data
    .map(item => item.description)
    .filter(desc => desc !== undefined);
  
  // 4. 改行で区切った文字列に変換する
  const textContent = descriptions.join('\n');
  
  // 5. テキストファイルとして書き出す
  fs.writeFileSync(outputPath, textContent, 'utf8');
  
  console.log(`サクセス！ ${outputPath} に出力しました。`);
} catch (error) {
  console.error('エラーが発生しました:', error.message);
}