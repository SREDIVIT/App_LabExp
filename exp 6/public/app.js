document.addEventListener('DOMContentLoaded', () => {
  const noteForm = document.getElementById('note-form');
  const titleInput = document.getElementById('title');
  const categorySelect = document.getElementById('category');
  const contentInput = document.getElementById('content');
  const notesGrid = document.getElementById('notes-grid');
  const emptyState = document.getElementById('empty-state');
  const searchInput = document.getElementById('search');

  let notes = [];

  async function fetchNotes() {
    try {
      const res = await fetch('/api/notes');
      notes = await res.json();
      renderNotes();
    } catch (err) {
      console.error('Failed to fetch notes:', err);
    }
  }

  function renderNotes(filterQuery = '') {
    notesGrid.innerHTML = '';
    const filtered = notes.filter(n => 
      n.title.toLowerCase().includes(filterQuery.toLowerCase()) || 
      n.content.toLowerCase().includes(filterQuery.toLowerCase())
    );

    if (filtered.length === 0) {
      emptyState.classList.remove('hidden');
    } else {
      emptyState.classList.add('hidden');
    }

    filtered.forEach(note => {
      const card = document.createElement('div');
      card.className = 'note-card';
      card.innerHTML = `
        <div>
          <div class="note-title">${escapeHtml(note.title)}</div>
          <div class="note-content">${escapeHtml(note.content)}</div>
        </div>
        <div class="note-meta">
          <span class="badge">${escapeHtml(note.category)}</span>
          <button class="btn-delete" title="Delete Note">&times;</button>
        </div>
      `;

      card.querySelector('.btn-delete').addEventListener('click', () => deleteNote(note._id));
      notesGrid.appendChild(card);
    });
  }

  noteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newNote = {
      title: titleInput.value.trim(),
      category: categorySelect.value,
      content: contentInput.value.trim()
    };

    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNote)
      });
      if (res.ok) {
        titleInput.value = '';
        contentInput.value = '';
        fetchNotes();
      }
    } catch (err) {
      console.error('Failed to save note:', err);
    }
  });

  async function deleteNote(id) {
    try {
      await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      fetchNotes();
    } catch (err) {
      console.error('Failed to delete note:', err);
    }
  }

  searchInput.addEventListener('input', (e) => {
    renderNotes(e.target.value);
  });

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, match => {
      const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
      return map[match];
    });
  }

  fetchNotes();
});
