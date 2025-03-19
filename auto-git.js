import chokidar from 'chokidar';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize watcher
const watcher = chokidar.watch('.', {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true,
  ignoreInitial: true
});

// Debounce function to prevent multiple commits
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Function to commit and push changes
function commitAndPush() {
  console.log('Changes detected, committing...');
  
  const commands = [
    'git add .',
    'git commit -m "Auto commit: Update files"',
    'git push'
  ];

  let currentCommand = 0;

  function executeNextCommand() {
    if (currentCommand >= commands.length) {
      console.log('All changes pushed to GitHub!');
      return;
    }

    exec(commands[currentCommand], (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing ${commands[currentCommand]}:`, error);
        return;
      }
      console.log(stdout);
      currentCommand++;
      executeNextCommand();
    });
  }

  executeNextCommand();
}

// Debounced version of commitAndPush
const debouncedCommitAndPush = debounce(commitAndPush, 2000);

// Watch for changes
watcher
  .on('add', path => {
    console.log(`File ${path} has been added`);
    debouncedCommitAndPush();
  })
  .on('change', path => {
    console.log(`File ${path} has been changed`);
    debouncedCommitAndPush();
  })
  .on('unlink', path => {
    console.log(`File ${path} has been removed`);
    debouncedCommitAndPush();
  });

console.log('Watching for changes...'); 