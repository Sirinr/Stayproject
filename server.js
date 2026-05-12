const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const app = express()
app.use(cors())
app.use(express.json())

// Создаем папку для изображений
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir)
}

// Настраиваем multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    // Генерируем уникальное имя файла
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname)
    cb(null, uniqueName)
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Проверяем, что файл - изображение
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed!'), false)
    }
  }
})

// Подключение к базе данных
const db = new sqlite3.Database('./rooms.db')

// Создание таблицы
db.run(`CREATE TABLE IF NOT EXISTS rooms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  location TEXT,
  pricePrNight REAL,
  image TEXT,
  rating REAL
)`)

// Middleware для проверки API ключа
function checkApiKey(req, res, next) {
  const auth = req.headers.authorization
  if (auth === 'Bearer Stay123') {
    next()
  } else {
    res.status(401).json({ error: 'Unauthorized' })
  }
}

// Статические файлы (изображения)
app.use('/uploads', express.static(uploadsDir))

// GET /api/rooms - получить все комнаты
app.get('/api/rooms', (req, res) => {
  db.all('SELECT * FROM rooms', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json(rows)
  })
})

// POST /api/rooms - создать комнату с загрузкой файла
app.post('/api/rooms', checkApiKey, upload.single('image'), (req, res) => {
  try {
    const { name, location, pricePrNight, rating } = req.body
    const image = req.file ? `/uploads/${req.file.filename}` : null

    if (!name || !location || !pricePrNight || !rating || !image) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    db.run(`INSERT INTO rooms (name, location, pricePrNight, image, rating)
            VALUES (?, ?, ?, ?, ?)`,
      [name, location, parseFloat(pricePrNight), image, parseFloat(rating)],
      function(err) {
        if (err) return res.status(500).json({ error: err.message })
        res.json({
          id: this.lastID,
          name,
          location,
          pricePrNight: parseFloat(pricePrNight),
          image,
          rating: parseFloat(rating)
        })
      })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// DELETE /api/rooms/:id - удалить комнату
app.delete('/api/rooms/:id', checkApiKey, (req, res) => {
  // Сначала получаем информацию о комнате, чтобы удалить файл
  db.get('SELECT image FROM rooms WHERE id = ?', req.params.id, (err, row) => {
    if (err) return res.status(500).json({ error: err.message })

    if (row && row.image) {
      // Удаляем файл с диска
      const imagePath = path.join(__dirname, row.image)
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath)
      }
    }

    // Удаляем запись из базы
    db.run('DELETE FROM rooms WHERE id = ?', req.params.id, (err) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json({ message: 'Room deleted' })
    })
  })
})

// PUT /api/rooms/:id - обновить комнату
app.put('/api/rooms/:id', checkApiKey, upload.single('image'), (req, res) => {
  const { name, location, pricePrNight, rating } = req.body
  const image = req.file ? `/uploads/${req.file.filename}` : req.body.image

  db.run(`UPDATE rooms SET name=?, location=?, pricePrNight=?, image=?, rating=?
          WHERE id=?`,
    [name, location, parseFloat(pricePrNight), image, parseFloat(rating), req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json({ message: 'Room updated' })
    })
})

app.listen(3000, () => console.log('Server running on port 3000'))