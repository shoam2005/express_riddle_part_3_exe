import express from 'express'
import { readDb, writeDb } from '../db/dbHelpers.js'

const router = express.Router()

router.get('/', async (req, res) => {
    const db = await readDb();
    res.json(db.players);
})

router.get('/', async (req, res) => {

    const db = await readDb()
    const searchName = req.query.name
    if (searchName) {
        const filterPlayers = db.players.filter(p => p.name === searchName)
        return res.json(filterPlayers

        )
    }


    return res.json(db.players)
})

router.post('/', async (req, res) => {
    const db = await readDb()

   
    const newPlayer = { lowestTime: null, ...req.body }

    db.players.push(newPlayer)
    await writeDb(db)
    res.status(201).json(newPlayer)
})

router.put('/:id',async(req,res)=>{
    const db = await readDb()
    const id = Number(req.params.id)
    const player = db.players.find(p => p.id === id)
    if (!player) {
        return res.json({ error: 'Player not found' })
    }
    player.lowestTime=req.body.lowestTime

    await writeDb(db)
    res.json(player)
})
export default router;