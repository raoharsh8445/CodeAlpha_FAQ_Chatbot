let faqs = [];

fetch("faq.json")
  .then(response => response.json())
  .then(data => {
    faqs = data;
  });

function textToVector(text) {
  let words = text.toLowerCase().split(/\W+/);
  let vector = {};

  words.forEach(word => {
    if (word) {
      vector[word] = (vector[word] || 0) + 1;
    }
  });

  return vector;
}

function cosineSimilarity(vec1, vec2) {
  let dot = 0;
  let mag1 = 0;
  let mag2 = 0;

  let words = new Set([...Object.keys(vec1), ...Object.keys(vec2)]);

  words.forEach(word => {
    let a = vec1[word] || 0;
    let b = vec2[word] || 0;

    dot += a * b;
    mag1 += a * a;
    mag2 += b * b;
  });

  if (mag1 === 0 || mag2 === 0) return 0;

  return dot / (Math.sqrt(mag1) * Math.sqrt(mag2));
}

function findAnswer() {

  let input = document.getElementById("userInput").value;

  let inputVector = textToVector(input);

  let bestScore = 0;
  let bestAnswer = "Sorry, I couldn't find an answer.";

  faqs.forEach(faq => {

    let faqVector = textToVector(faq.question);

    let score = cosineSimilarity(inputVector, faqVector);

    if (score > bestScore) {
      bestScore = score;
      bestAnswer = faq.answer;
    }

  });

  let chatBox = document.getElementById("chatBox");

  chatBox.innerHTML += `<div class="user"><b>You:</b> ${input}</div>`;

  chatBox.innerHTML += `<div class="bot"><b>Bot:</b> ${bestAnswer}</div>`;

  document.getElementById("userInput").value = "";

  chatBox.scrollTop = chatBox.scrollHeight;

}