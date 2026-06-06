import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory() && !file.includes('node_modules') && !file.includes('.git') && !file.includes('.firebase') && !file.includes('dist')) { 
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.html')) results.push(file);
    }
  });
  return results;
}

const files = walk('.');
files.forEach(file => {
  // Skip arcade/index.html because it's the hub itself
  if (file.includes('arcade/index.html') || file.includes('arcade\\index.html')) {
    return;
  }

  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Determine relative path back to root based on depth
  const normalized = file.replace(/\\/g, '/').replace(/^\.\//, '');
  const parts = normalized.split('/');
  const depth = parts.length - 1;

  let relativeArcade = './arcade/';
  if (depth === 1) {
    relativeArcade = '../arcade/';
  } else if (depth === 2) {
    relativeArcade = '../../arcade/';
  } else if (depth === 3) {
    relativeArcade = '../../../arcade/';
  }

  // Match variations of old arcade links
  const legacyLinkRegex = /href=["'][^"']*arcade\/matrix-of-conscience\/(?:\?ext=[^"']*)?["']/gi;
  
  content = content.replace(legacyLinkRegex, `href="${relativeArcade}"`);

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file} (depth ${depth}) -> href="${relativeArcade}"`);
  }
});
