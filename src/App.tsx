// src/App.tsx
import React, { useState } from 'react'
import {
    Container,
    Typography,
    Box,
    Grid,
    TextField,
    Paper,
} from '@mui/material'
import { Character } from './types'

const App: React.FC = () => {
    // Initialize the character state
    const [character, setCharacter] = useState<Character>({
        name: 'Hero Name',
        power: {
            intelligence: 3,
            magic: 2,
            appearance: 4,
        },
        grace: {
            acumen: 3,
            luck: 1,
            manipulation: 5,
        },
        resistance: {
            resoluteness: 4,
            bodyControl: 2,
            poise: 3,
        },
    })

    // Handler to update character attributes
    const handleAttributeChange = (
        group: keyof Omit<Character, 'name'>,
        attribute: string,
        value: number
    ) => {
        setCharacter((prev) => ({
            ...prev,
            [group]: {
                ...prev[group],
                [attribute]: value,
            },
        }))
    }

    // Handler to update character name
    const handleNameChange = (value: string) => {
        setCharacter((prev) => ({
            ...prev,
            name: value,
        }))
    }

    // Render a group of attributes
    const renderAttributeGroup = (
        groupName: string,
        attributes: { [key: string]: number },
        groupKey: keyof Omit<Character, 'name'>
    ) => (
        <Box mb={3}>
            <Typography variant="h6" gutterBottom>
                {groupName}
            </Typography>
            <Grid container spacing={2}>
                {Object.entries(attributes).map(([attrName, attrValue]) => (
                    <Grid item xs={4} key={attrName}>
                        <TextField
                            label={attrName.charAt(0).toUpperCase() + attrName.slice(1)}
                            type="number"
                            inputProps={{ min: 1, max: 5 }}
                            value={attrValue}
                            onChange={(e) =>
                                handleAttributeChange(
                                    groupKey,
                                    attrName,
                                    Number(e.target.value) > 5
                                        ? 5
                                        : Number(e.target.value) < 1
                                            ? 1
                                            : Number(e.target.value)
                                )
                            }
                            fullWidth
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    )

    return (
        <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
            <Paper elevation={3} style={{ padding: '2rem' }}>
                {/* Character Name */}
                <Box mb={4}>
                    <TextField
                        label="Character Name"
                        value={character.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        fullWidth
                        variant="outlined"
                        InputProps={{
                            style: { fontSize: '1.5rem' },
                        }}
                        InputLabelProps={{
                            style: { fontSize: '1.2rem' },
                        }}
                    />
                </Box>

                {/* Power Group */}
                {renderAttributeGroup('Power', character.power, 'power')}

                {/* Grace Group */}
                {renderAttributeGroup('Grace', character.grace, 'grace')}

                {/* Resistance Group */}
                {renderAttributeGroup('Resistance', character.resistance, 'resistance')}
            </Paper>
        </Container>
    )
}

export default App
