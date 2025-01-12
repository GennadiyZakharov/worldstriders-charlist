// src/types.ts
export interface Character {
    name: string
    power: {
        intelligence: number
        magic: number
        appearance: number
    }
    grace: {
        acumen: number
        luck: number
        manipulation: number
    }
    resistance: {
        resoluteness: number
        bodyControl: number
        poise: number
    }
}