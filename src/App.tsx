import { useState } from "react";
import { Button, TextField, List, ListItem, ListItemText, Container, Typography } from "@mui/material";

function CharacterList() {
    const [characters, setCharacters] = useState<string[]>([]);
    const [name, setName] = useState("");

    function addCharacter() {
        if (name.trim()) {
            setCharacters([...characters, name]);
            setName("");
        }
    }

    return (
        <Container maxWidth="sm" style={{ marginTop: "20px" }}>
            <Typography variant="h4" gutterBottom>
                LARP Character List
            </Typography>
            <TextField
                label="Character Name"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ marginBottom: "10px" }}
            />
            <Button variant="contained" color="primary" onClick={addCharacter} fullWidth>
                Add Character
            </Button>
            <List style={{ marginTop: "10px" }}>
                {characters.map((char, index) => (
                    <ListItem key={index} divider>
                        <ListItemText primary={char} />
                    </ListItem>
                ))}
            </List>
        </Container>
    );
}

export default CharacterList;
