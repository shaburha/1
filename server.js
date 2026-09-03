const express = require('express');
const documentsRouter = require('./routes/documents');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Collaborative Documents API',
    description: 'REST API системы совместного редактирования документов',
    endpoints: {
      'GET /documents': 'Список документов (query: owner, q)',
      'GET /documents/:id': 'Документ по идентификатору',
      'POST /documents': 'Создание документа',
      'PUT /documents/:id': 'Полное обновление документа',
      'DELETE /documents/:id': 'Удаление документа',
    },
  });
});

app.use('/documents', documentsRouter);
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
