/**
 * Initial DDL parser script. Might become useful in the future.
 */

const fs = require('fs');

const ddl = fs.readFileSync('./ddl.sql', { encoding: 'utf8' });

// Capitalize first letter, remove underscore, uppercase letters after underscore.
const getTableName = (s) => {
  const name = s.trim(); // Remove left and right padding
  return name.charAt(0).toUpperCase() + name.slice(1).replace(/_\w/g, m => m[1].toUpperCase());
};

const parseTable = (s) => {
  const [name, columns] = s
    .replace(/\);(.|\n)*/, '') // Remove everything after closing parenthesis
    .split('(\n'); // Split on starting parenthesis

  return {
    name: getTableName(name),
    columns: columns.split(',\n').map(l => l
      .trim() // Remove left and right padding
      .replace(/\s+/gm, ' ')), // Remove padding and formatting
  };
};

// const tables = ddl.split('create table ')
//   .slice(1, -1)
//   .map(parseTable);

const tables = ddl.split('create table').slice(1).map(parseTable);
console.log('tables', tables);
