/**
 * Google Apps Script Code
 * Copy and paste this into your Google Sheet's Script Editor (Extensions > Apps Script)
 */

const SHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();
const QUESTION_SHEET_NAME = '題目';
const ANSWER_SHEET_NAME = '回答';

function doGet(e) {
    const action = e.parameter.action;

    if (action === 'getQuestions') {
        return getQuestions();
    }

    return ContentService.createTextOutput(JSON.stringify({ error: 'Invalid action' }))
        .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
    try {
        const data = JSON.parse(e.postData.contents);
        const action = data.action;

        if (action === 'submit') {
            return submitQuiz(data.payload);
        }

        return ContentService.createTextOutput(JSON.stringify({ error: 'Invalid action' }))
            .setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
        return ContentService.createTextOutput(JSON.stringify({ error: err.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

function getQuestions() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(QUESTION_SHEET_NAME);
    // Assuming headers: ID, Question, A, B, C, D, E, Answer, ImgUrl(Optional)
    // Rows start from 2
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);

    // Pick 5 random
    const questions = [];
    const count = Math.min(5, rows.length); // Use 5 or all if less than 5

    // Scramble indices
    const indices = rows.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    for (let i = 0; i < count; i++) {
        const row = rows[indices[i]];
        // Map based on column validation (modify indices based on actual sheet layout)
        // Assuming: 0:ID, 1:Text, 2:A, 3:B, 4:C, 5:D, 6:E, 7:Answer, 8:ImgUrl
        questions.push({
            id: row[0].toString(),
            text: row[1],
            options: {
                A: row[2],
                B: row[3],
                C: row[4],
                D: row[5],
                E: row[6]
            },
            imgUrl: row[8] || '' // Optional image URL
        });
    }

    return ContentService.createTextOutput(JSON.stringify(questions))
        .setMimeType(ContentService.MimeType.JSON);
}

function submitQuiz(payload) {
    const { name, responses } = payload;
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(QUESTION_SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    const rows = data.slice(1);

    // Create a map for quick lookup of answers
    const answerKey = {}; // { questionId: { correctOption: 'A', text: '...', ... } }


    rows.forEach(row => {
        // ID is at index 0, Answer at index 7
        const id = row[0].toString();
        answerKey[id] = {
            correctOption: row[7], // e.g., 'A'
            text: row[1],
            explanation: row[9] || '' // Column J (index 9)
        };
    });

    let score = 0;
    const details = [];
    const logDetails = []; // For storing in spreadsheet

    const questionResults = []; // Stores 1 or 0 for each question

    responses.forEach(r => {
        const key = answerKey[r.questionId];
        if (key) {
            const isCorrect = r.selectedOption === key.correctOption;
            if (isCorrect) score++;

            details.push({
                questionId: r.questionId,
                questionText: key.text,
                userAnswer: r.selectedOption,
                isCorrect: isCorrect,
                correctAnswer: key.correctOption,
                explanation: key.explanation
            });

            questionResults.push(isCorrect ? '' : key.text);
        } else {
            questionResults.push(''); // Should not happen if data is consistent
        }
    });

    // Save to "回答" Sheet
    const answerSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(ANSWER_SHEET_NAME);
    // Columns: Name, Timestamp, Score, Q1, Q2, Q3, Q4, Q5
    const rowData = [
        name,
        new Date(),
        score,
        ...questionResults
    ];
    answerSheet.appendRow(rowData);

    const result = {
        score: score,
        totalQuestions: responses.length,
        details: details
    };

    return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
}
