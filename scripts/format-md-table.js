#!/usr/bin/env node

function formatMarkdownTable(input) {
    // Split input into lines
    const lines = input.split('\n');

    // Find table boundaries
    let tableStart = -1;
    let tableEnd = -1;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('|') && tableStart === -1) {
            tableStart = i;
        } else if (tableStart !== -1 && (!line || !line.startsWith('|'))) {
            tableEnd = i;
            break;
        }
    }
    if (tableEnd === -1) tableEnd = lines.length;

    // If no table found, return original text
    if (tableStart === -1) return input;

    // Extract table lines
    const tableLines = lines.slice(tableStart, tableEnd);

    // Parse the table
    const rows = tableLines.map(line =>
        line.trim()
            .replace(/^\||\|$/g, '') // Remove first and last pipes
            .split('|')
            .map(cell => cell.trim())
    );

    // Get the maximum width for each column
    const columnWidths = [];
    rows.forEach(row => {
        row.forEach((cell, i) => {
            columnWidths[i] = Math.max(columnWidths[i] || 0, cell.length);
        });
    });

    // Format each row
    const formattedRows = rows.map((row, rowIndex) => {
        const formattedCells = row.map((cell, columnIndex) => {
            const width = columnWidths[columnIndex];
            // Don't pad separator row
            if (rowIndex === 1 && cell.match(/^-+$/)) {
                return '-'.repeat(width);
            }
            return cell.padEnd(width);
        });
        return '| ' + formattedCells.join(' | ') + ' |';
    });

    // If there's no separator row after header, add it
    if (!formattedRows[1] || !formattedRows[1].includes('---')) {
        const separator = columnWidths.map(width => '-'.repeat(width));
        formattedRows.splice(1, 0, '| ' + separator.join(' | ') + ' |');
    }

    // Combine everything back together
    const result = [
        ...lines.slice(0, tableStart),
        ...formattedRows,
        ...lines.slice(tableEnd)
    ];

    // Remove any trailing empty lines within the table
    return result.join('\n').replace(/\n+$/, '\n');
}

// If running from command line
if (require.main === module) {
    let input = '';
    process.stdin.setEncoding('utf8');

    process.stdin.on('data', chunk => {
        input += chunk;
    });

    process.stdin.on('end', () => {
        const formatted = formatMarkdownTable(input);
        console.log(formatted);
    });
}

module.exports = formatMarkdownTable; 