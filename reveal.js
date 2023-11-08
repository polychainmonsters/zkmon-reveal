const fs = require('fs');
const seedrandom = require('seedrandom');

// Function to shuffle array using a seed, excluding header and empty lines
const shuffleArray = (array, seed) => {
  const rng = seedrandom(seed);
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Function to shuffle the CSV rows based on a seed, ignoring the header and empty lines
const shuffleCSVRows = (filePath, seed) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }

    // Split the data into lines and then into columns
    let lines = data.split(/\r?\n/);
    const header = lines.shift(); // Extract the header

    // Filter out any empty lines
    lines = lines.filter(line => line.trim() !== '');

    // Map lines to columns
    let columns = lines.map(line => line.split(';'));

    // Keep the first two columns as they are and shuffle the rest
    const firstTwoCols = columns.map(line => line.slice(0, 2));
    let remainingCols = columns.map(line => line.slice(2));

    remainingCols = shuffleArray(remainingCols, seed);

    // Combine the first two columns with the shuffled remaining columns
    const shuffledLines = firstTwoCols.map((cols, index) => {
      return [...cols, ...remainingCols[index]]; // Flatten the sub-array
    });

    // Combine the header and the shuffled lines, and join each line into a string
    const shuffledData = [header, ...shuffledLines.map(line => line.join(';'))].join('\n');

    // Write the shuffled data back to the file or to a new file
    fs.writeFile(`revealed.csv`, shuffledData, 'utf8', (err) => {
      if (err) {
        console.error('Error writing the file:', err);
      } else {
        console.log('CSV shuffled successfully!');
      }
    });
  });
};

// Replace 'yourfile.csv' with the path to your actual CSV file and provide a seed value
const csvFilePath = 'unrevealed.csv';
const seedValue = 'seed-will-be-fetched-from-chainlink';
shuffleCSVRows(csvFilePath, seedValue);
