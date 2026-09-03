const documents = require('../models/document');

function parseId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    const error = new Error('Некорректный идентификатор документа');
    error.status = 400;
    throw error;
  }
  return id;
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateDocumentPayload(body, { partial = false } = {}) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    const error = new Error('Тело запроса должно быть JSON-объектом');
    error.status = 400;
    throw error;
  }

  const hasTitle = Object.prototype.hasOwnProperty.call(body, 'title');
  const hasOwner = Object.prototype.hasOwnProperty.call(body, 'owner');
  const hasContent = Object.prototype.hasOwnProperty.call(body, 'content');
  const hasCollaborators = Object.prototype.hasOwnProperty.call(body, 'collaborators');

  if (!partial && (!hasTitle || !hasOwner)) {
    const error = new Error('Поля title и owner обязательны');
    error.status = 400;
    throw error;
  }

  if ((hasTitle || !partial) && !isNonEmptyString(body.title)) {
    const error = new Error('Поле title должно быть непустой строкой');
    error.status = 400;
    throw error;
  }

  if ((hasOwner || !partial) && !isNonEmptyString(body.owner)) {
    const error = new Error('Поле owner должно быть непустой строкой');
    error.status = 400;
    throw error;
  }

  if (hasContent && typeof body.content !== 'string') {
    const error = new Error('Поле content должно быть строкой');
    error.status = 400;
    throw error;
  }

  if (hasCollaborators) {
    const validCollaborators =
      Array.isArray(body.collaborators) &&
      body.collaborators.every((item) => typeof item === 'string');
    if (!validCollaborators) {
      const error = new Error('Поле collaborators должно быть массивом строк');
      error.status = 400;
      throw error;
    }
  }
}

function listDocuments(req, res, next) {
  try {
    const { owner, q } = req.query;
    let result = documents.getAll();

    if (owner) {
      result = result.filter((doc) => doc.owner === owner);
    }

    if (q) {
      const term = String(q).toLowerCase();
      result = result.filter(
        (doc) =>
          doc.title.toLowerCase().includes(term) ||
          doc.content.toLowerCase().includes(term)
      );
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

function getDocument(req, res, next) {
  try {
    const id = parseId(req.params.id);
    const document = documents.getById(id);

    if (!document) {
      const error = new Error(`Документ с id=${id} не найден`);
      error.status = 404;
      throw error;
    }

    res.status(200).json(document);
  } catch (error) {
    next(error);
  }
}

function createDocument(req, res, next) {
  try {
    validateDocumentPayload(req.body);
    const document = documents.create({
      title: req.body.title.trim(),
      content: req.body.content ?? '',
      owner: req.body.owner.trim(),
      collaborators: req.body.collaborators ?? [],
    });
    res.status(201).json(document);
  } catch (error) {
    next(error);
  }
}

function replaceDocument(req, res, next) {
  try {
    const id = parseId(req.params.id);
    validateDocumentPayload(req.body);

    const document = documents.replace(id, {
      title: req.body.title.trim(),
      content: req.body.content ?? '',
      owner: req.body.owner.trim(),
      collaborators: req.body.collaborators ?? [],
    });

    if (!document) {
      const error = new Error(`Документ с id=${id} не найден`);
      error.status = 404;
      throw error;
    }

    res.status(200).json(document);
  } catch (error) {
    next(error);
  }
}

function deleteDocument(req, res, next) {
  try {
    const id = parseId(req.params.id);
    const removed = documents.remove(id);

    if (!removed) {
      const error = new Error(`Документ с id=${id} не найден`);
      error.status = 404;
      throw error;
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listDocuments,
  getDocument,
  createDocument,
  replaceDocument,
  deleteDocument,
};
