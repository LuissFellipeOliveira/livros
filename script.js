let timeout = null;

function suggestBooks() {
    const query = document.getElementById('search-input').value;

    if (timeout) {
        clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
        if (query.length > 2) {
            const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}`;

            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    displaySuggestions(data.items);
                })
                .catch(error => {
                    console.error('Erro ao buscar sugestões:', error);
                });
        } else {
            clearSuggestions();
        }
    }, 300); // Adiciona um pequeno atraso de 300ms antes de fazer a busca
}

function displaySuggestions(books) {
    const suggestionsDiv = document.getElementById('suggestions');
    suggestionsDiv.innerHTML = '';

    if (!books) {
        return;
    }

    books.forEach(book => {
        const suggestionItem = document.createElement('div');
        suggestionItem.classList.add('suggestion-item');
        
        const title = book.volumeInfo.title || 'Título desconhecido';

        suggestionItem.textContent = title;

        suggestionItem.addEventListener('click', () => {
            document.getElementById('search-input').value = title;
            searchBooks();  // Realiza a busca completa quando o item é clicado
            clearSuggestions();
        });

        suggestionsDiv.appendChild(suggestionItem);
    });
}

function clearSuggestions() {
    document.getElementById('suggestions').innerHTML = '';
}

function searchBooks() {
    const query = document.getElementById('search-input').value;
    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayBooks(data.items);
        })
        .catch(error => {
            console.error('Erro ao buscar livros:', error);
        });
}

function displayBooks(books) {
    const resultsDiv = document.getElementById('book-results');
    resultsDiv.innerHTML = '';

    if (!books) {
        resultsDiv.innerHTML = '<p>Nenhum livro encontrado.</p>';
        return;
    }

    books.forEach(book => {
        const bookItem = document.createElement('div');
        bookItem.classList.add('book');

        const thumbnail = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/150';
        const title = book.volumeInfo.title || 'Título desconhecido';
        const author = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Autor desconhecido';
        const description = book.volumeInfo.description ? book.volumeInfo.description.substring(0, 100) + '...' : 'Sem descrição disponível';

        bookItem.innerHTML = `
            <img src="${thumbnail}" alt="Capa do livro">
            <h3 class="book-title">${title}</h3>
            <p class="book-author">Autor: ${author}</p>
            <p class="book-description">${description}</p>
        `;

        resultsDiv.appendChild(bookItem);
    });
}
