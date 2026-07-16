const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            if(file.indexOf('node_modules') === -1) {
                results = results.concat(walk(file));
            }
        } else { 
            if(file.endsWith('.js') || file.endsWith('.jsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('c:/Users/Gull/Documents/MentorWise/frontend/src');
let changedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;
    
    // Replace backticks: `http://localhost:5000/...` -> `${import.meta.env.VITE_API_URL}/...`
    content = content.replace(/`http:\/\/localhost:5000/g, '`${import.meta.env.VITE_API_URL}');
    
    // Replace single quotes: 'http://localhost:5000/...' -> `${import.meta.env.VITE_API_URL}/...`
    content = content.replace(/'http:\/\/localhost:5000([^']*)'/g, '`${import.meta.env.VITE_API_URL}$1`');
    
    // Replace double quotes: "http://localhost:5000/..." -> `${import.meta.env.VITE_API_URL}/...`
    content = content.replace(/"http:\/\/localhost:5000([^"]*)"/g, '`${import.meta.env.VITE_API_URL}$1`');
    
    if(content !== originalContent) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated:', file);
        changedCount++;
    }
});
console.log('Total files updated:', changedCount);
