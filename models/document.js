const documents = [
  {
    id: 1,
    title: 'Техническое задание',
    content: 'Описание системы совместного редактирования документов.',
    owner: 'ivanov',
    collaborators: ['petrov', 'sidorova'],
    createdAt: '2026-09-01T10:00:00.000Z',
    updatedAt: '2026-09-01T12:30:00.000Z',
  },
  {
    id: 2,
    title: 'Протокол совещания',
    content: 'Решения по архитектуре realtime-синхронизации.',
    owner: 'petrov',
    collaborators: ['ivanov'],
    createdAt: '2026-09-02T09:15:00.000Z',
    updatedAt: '2026-09-02T09:15:00.000Z',
  },
  {
    id: 3,
    title: 'Черновик статьи',
    content: 'Введение в операционные преобразования (OT).',
    owner: 'sidorova',
    collaborators: [],
    createdAt: '2026-09-03T08:00:00.000Z',
    updatedAt: '2026-09-03T11:45:00.000Z',
  },
];

let nextId = 4;

function getAll() {
  return documents;
}

function getById(id) {
  return documents.find((doc) => doc.id === id) || null;
}

function create(data) {
  const now = new Date().toISOString();
  const document = {
    id: nextId++,
    title: data.title,
    content: data.content ?? '',
    owner: data.owner,
    collaborators: Array.isArray(data.collaborators) ? data.collaborators : [],
    createdAt: now,
    updatedAt: now,
  };
  documents.push(document);
  return document;
}

function replace(id, data) {
  const index = documents.findIndex((doc) => doc.id === id);
  if (index === -1) {
    return null;
  }

  const previous = documents[index];
  const updated = {
    id,
    title: data.title,
    content: data.content ?? '',
    owner: data.owner,
    collaborators: Array.isArray(data.collaborators) ? data.collaborators : [],
    createdAt: previous.createdAt,
    updatedAt: new Date().toISOString(),
  };
  documents[index] = updated;
  return updated;
}

function remove(id) {
  const index = documents.findIndex((doc) => doc.id === id);
  if (index === -1) {
    return false;
  }
  documents.splice(index, 1);
  return true;
}

module.exports = {
  getAll,
  getById,
  create,
  replace,
  remove,
};
