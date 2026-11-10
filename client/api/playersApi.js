const API_URL = 'http://localhost:3000/api/players';

export async function getAllPlayers() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`error server: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('failed on load players', error.message);
        return [];
    }
}

export async function findPlayerByName(name) {
    try {
        const players = await getAllPlayers();
        const player = players.find(p => p.name.toLowerCase() === name.toLowerCase());
        
        return player !== undefined ? player : undefined;
    } catch (error) {
        console.error('failed on search player', error.message);
        return undefined;
    }
}
export async function createPlayer(name) {
    try {
        const newPlayer = {
            name: name,
            lowestTime: null
        };

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPlayer)
        });

        if (!response.ok) throw new Error(`error server ${response.status}`);
        
        const createdPlayer = await response.json();
        console.log(`Player ${name} created successfully!`);
        return createdPlayer;
    } catch (error) {
        console.error('failed on create player', error.message);
    }
}

export async function updatePlayer(player) {
    try {
        const response = await fetch(`${API_URL}/${player.id}`, {
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(player)
        });

        if (!response.ok) throw new Error(`error server: ${response.status}`);
        
        const updatedPlayer = await response.json();
        console.log(`Player ${player.name} updated successfully!`);
        return updatedPlayer;
    } catch (error) {
        console.error('failed on update player', error.message);
    }
}