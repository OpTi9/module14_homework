// Задание 1
	const xmlString = '<list><student><name lang="en"><first>Ivan</first><second>Ivanov</second></name><age>35</age><prof>teacher</prof></student><student><name lang="ru"><first>Петр</first><second>Петров</second></name><age>58</age><prof>driver</prof></student></list>';

	const parser = new DOMParser();
	const xmlDOM = parser.parseFromString(xmlString, 'text/xml');

	const students = xmlDOM.querySelectorAll('student');
	const result = { list: [] };

	for (let i = 0; i < students.length; i++) {
	  const student = students[i];
	  const name = student.querySelector('name');
	  const first = name.querySelector('first').textContent;
	  const second = name.querySelector('second').textContent;
	  const age = student.querySelector('age').textContent;
	  const prof = student.querySelector('prof').textContent;
	  const lang = name.getAttribute('lang');
	  result.list.push({ name: `${first} ${second}`, age: Number(age), prof, lang });
	}

	console.log(result);


// Задание 2
	const jsonString = '{"list":[{"name":"Petr","age":"20","prof":"mechanic"},{"name":"Vova","age":"60","prof":"pilot"}]}';

	const result = JSON.parse(jsonString, (key, value) => {
	  if (key === 'age') {
		return Number(value);
	  }
	  return value;
	});

console.log(result);


// Задание 3
	//HTML:
	<input type="number" id="numberInput">
	<button id="submitButton">Submit</button>
	<div id="output"></div>
	//JS:
	const numberInput = document.querySelector('#numberInput');
	const submitButton = document.querySelector('#submitButton');
	const outputDiv = document.querySelector('#output');

	submitButton.addEventListener('click', () => {
	  const value = Number(numberInput.value);

	  if (value < 1 || value > 10) {
		outputDiv.textContent = 'Число вне диапазона от 1 до 10';
	  } else {
		const url = `https://picsum.photos/v2/list?limit=${value}`;
		const xhr = new XMLHttpRequest();

		xhr.onload = function() {
		  if (xhr.status === 200) {
			const response = JSON.parse(xhr.responseText);
			outputDiv.innerHTML = '';
			response.forEach(item => {
			  const img = document.createElement('img');
			  img.src = item.download_url;
			  outputDiv.appendChild(img);
			});
		  } else {
			outputDiv.textContent = 'Ошибка при загрузке изображений';
		  }
		};

		xhr.open('GET', url);
		xhr.send();
	  }
	});
	
	
// Задание 4
	//HTML
	<!DOCTYPE html>
	<html>
	<head>
	  <meta charset="UTF-8">
	  <title>Пример приложения с запросом картинки</title>
	</head>
	<body>
	  <label>Первое число:</label>
	  <input type="text" id="input1"><br>
	  <label>Второе число:</label>
	  <input type="text" id="input2"><br>
	  <button id="submitButton">Отправить запрос</button>
	  <div id="resultContainer"></div>
	  <script src="script.js"></script>
	</body>
	</html>
	
	//JS
	// получаем ссылки на элементы интерфейса
	const input1 = document.getElementById("input1");
	const input2 = document.getElementById("input2");
	const submitButton = document.getElementById("submitButton");
	const resultContainer = document.getElementById("resultContainer");

	// добавляем обработчик клика на кнопку
	submitButton.addEventListener("click", () => {
	  // получаем значения из input
	  const value1 = parseInt(input1.value);
	  const value2 = parseInt(input2.value);

	  // проверяем, что введены числа и они в диапазоне от 100 до 300
	  if (isNaN(value1) || isNaN(value2) || value1 < 100 || value1 > 300 || value2 < 100 || value2 > 300) {
		resultContainer.innerHTML = "Одно из чисел вне диапазона от 100 до 300";
		return;
	  }

	  // формируем URL для запроса
	  const url = `https://picsum.photos/${value1}/${value2}`;

	  // отправляем запрос и получаем результат в виде blob-объекта
	  fetch(url)
		.then(response => response.blob())
		.then(blob => {
		  // создаем объект для отображения картинки
		  const img = document.createElement("img");
		  img.src = URL.createObjectURL(blob);

		  // добавляем картинку в контейнер с результатом
		  resultContainer.innerHTML = "";
		  resultContainer.appendChild(img);
		});
	});


// Задание 5
	//HTML
	<label for="page-input">Номер страницы:</label>
	<input id="page-input" type="text" name="page">

	<label for="limit-input">Лимит:</label>
	<input id="limit-input" type="text" name="limit">

	<button id="submit-button">Запрос</button>

	<div id="result-container"></div>

	//JS
	const pageInput = document.getElementById('page-input');
	const limitInput = document.getElementById('limit-input');
	const submitButton = document.getElementById('submit-button');
	const resultContainer = document.getElementById('result-container');

	const lastPage = localStorage.getItem('lastPage');
	const lastLimit = localStorage.getItem('lastLimit');

	if (lastPage && lastLimit) {
	  pageInput.value = lastPage;
	  limitInput.value = lastLimit;
	  makeRequest();
	}

	submitButton.addEventListener('click', makeRequest);

	function makeRequest() {
	  const page = parseInt(pageInput.value);
	  const limit = parseInt(limitInput.value);

	  let errorMessage = '';

	  if (isNaN(page) || page < 1 || page > 10) {
		errorMessage += 'Номер страницы вне диапазона от 1 до 10\n';
	  }

	  if (isNaN(limit) || limit < 1 || limit > 10) {
		errorMessage += 'Лимит вне диапазона от 1 до 10\n';
	  }

	  if (errorMessage) {
		resultContainer.innerText = errorMessage;
		return;
	  }

	  localStorage.setItem('lastPage', page);
	  localStorage.setItem('lastLimit', limit);

	  const url = `https://picsum.photos/v2/list?page=${page}&limit=${limit}`;

	  fetch(url)
		.then(response => response.json())
		.then(data => {
		  let resultHTML = '';
		  for (const item of data) {
			resultHTML += `<img src="${item.download_url}" alt="${item.author}">\n`;
		  }
		  resultContainer.innerHTML = resultHTML;
		})
		.catch(error => {
		  resultContainer.innerText = 'Произошла ошибка при выполнении запроса';
		  console.error(error);
		});
	}