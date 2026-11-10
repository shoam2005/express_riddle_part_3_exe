export async function getAllRiddles() {
    try {
        const res = await fetch("http://localhost:3000/api/riddles");
        if (!res.ok) {
            throw new Error(`${res.status}:${res.statusText}`);
        }
        const riddles = await res.json()
        return riddles;
    }
    catch {
        console.error("error server", error.message);
        return null
    }
}
const listRiddles = await getAllRiddles()
console.log(listRiddles)

export async function createRiddle(riddle) {
    try {
        const res = await fetch("http://localhost:3000/api/riddles", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(riddle)
        })

        if (!res.ok) {
            throw new Error(`${res.status}:${res.statusText}`);

        }

        const create = await res.json()
        console.log("succses create:", create)
    }
    catch (error) {
        console.error("failed create riddle", error.message)
        return null
    }
}


export async function updateRiddle(id, riddle) {
    try {
        const res = await fetch(`https://api.example.com/api/riddles/${id}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(riddle)
            })

        if(!res.ok){
            throw new Error(`${res.status}:${res.statusText}`);
            
        }
        const update=await res.json();
        console.log('succes update:',update)
    }
    catch{
        console.Error('failed update:',error.message)
        return null
    }
 }

 export async function deleteRiddle(id){
    try{
        const res=await fetch(`https://api.example.com/api/riddles/${id}`,
            {
                method: 'DELETE'   ,
                headers: {
                'Content-Type': 'application/json'
            }           
            }
        )
        if(!res.ok){
            throw new Error(`${res.status}:${res.statusText}`);
            
        }
        const deleteriddle=await res.json();
        console.log('succes delet:',deleteriddle)

    }
    catch{
        console.error('failed delete',error.message)
        return null
    }
 }