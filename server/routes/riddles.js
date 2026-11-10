import express from 'express'
import { readDb, writeDb } from '../db/dbHelpers.js'


const router = express.Router()

router.get('/', async (req, res) => {
    const db = await readDb();
    res.json(db.riddles);
})
router.get('/:id', async (req, res) => {
    const db = await readDb()
    const id = Number(req.params.id)
    const riddle = db.riddles.find(r => r.id === id)

    if (!riddle) {
        return res.status(404).json({ error: "Riddle not found" })

    }
    res.json(riddle)
})

router.post('/', async (req, res) => {
    const db = await readDb()

    const maxId = db.riddles.length > 0 ? Math.max(...db.riddles.map(r => r.id)) : 0
    const newRiddle = { id: maxId + 1, ...req.body }

    db.riddles.push(newRiddle)
    await writeDb(db)
    res.status(201).json(newRiddle)

})
router.put('/:id', async (req, res) => {
    const db = await readDb()
    const id = Number(req.params.id)
    const index = db.riddles.findIndex(r => r.id === id)
    if (index === -1) {
        return res.status(404).json({ error: 'Riddle not found' })
    }
    db.riddles[index] = { id, ...req.body }
    await writeDb(db)
    res.json(db.riddles[index])
})

router.delete('/:id', async (req, res) => {
    const db = await readDb()
    const id = Number(req.params.id)
    const index = db.riddles.findIndex(r => r.id === id)
    if (index === -1) {
        return res.status(404).json({ error: 'Riddle not found' })
    }
    const deleted = db.riddles.splice(index, 1)
    await writeDb(db)
    res.json(deleted[0])
})
export default router;