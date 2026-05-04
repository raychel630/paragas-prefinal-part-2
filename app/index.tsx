import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/*
Strategy:
- Separate input values from applied values.
- Grid only updates when user clicks REGENERATE.
*/

export default function Index() {
  // 👉 INPUT STATES (what user types)
  const [inputSize, setInputSize] = useState("10");
  const [inputBombs, setInputBombs] = useState("6");

  // 👉 APPLIED STATES (used in grid)
  const [size, setSize] = useState(10);
  const [bombs, setBombs] = useState(6);

  const [board, setBoard] = useState<any[][]>([]);

  const generateBoard = () => {
    const newSize = Number(inputSize) || 1;
    const newBombs = Number(inputBombs) || 0;

    setSize(newSize);
    setBombs(newBombs);

    let newBoard: any[][] = [];

    // Create grid
    for (let i = 0; i < newSize; i++) {
      newBoard[i] = [];
      for (let j = 0; j < newSize; j++) {
        newBoard[i][j] = { bomb: false, count: 0 };
      }
    }

    // Place bombs
    let placed = 0;
    let maxBombs = Math.min(newBombs, newSize * newSize);

    while (placed < maxBombs) {
      let r = Math.floor(Math.random() * newSize);
      let c = Math.floor(Math.random() * newSize);

      if (!newBoard[r][c].bomb) {
        newBoard[r][c].bomb = true;
        placed++;
      }
    }

    // Count bombs
    const dirs = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],          [0, 1],
      [1, -1], [1, 0], [1, 1],
    ];

    for (let i = 0; i < newSize; i++) {
      for (let j = 0; j < newSize; j++) {
        if (newBoard[i][j].bomb) continue;

        let count = 0;

        dirs.forEach(([dx, dy]) => {
          let ni = i + dx;
          let nj = j + dy;

          if (
            ni >= 0 &&
            ni < newSize &&
            nj >= 0 &&
            nj < newSize &&
            newBoard[ni][nj].bomb
          ) {
            count++;
          }
        });

        newBoard[i][j].count = count;
      }
    }

    setBoard(newBoard);
  };

  const renderCell = ({ index }: any) => {
    const row = Math.floor(index / size);
    const col = index % size;
    const cell = board[row]?.[col];

    return (
      <View style={styles.cell}>
        <Text style={styles.cellText}>
          {cell?.bomb ? "💣" : cell?.count > 0 ? cell.count : ""}
        </Text>
      </View>
    );
  };

  const flatBoard = board.flat();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>App</Text>

      {/* GRID */}
      <FlatList
        key={size} // FIX error
        data={flatBoard}
        renderItem={renderCell}
        keyExtractor={(_, i) => i.toString()}
        numColumns={size || 1}
        scrollEnabled={false}
        style={styles.grid}
      />

      {/* INPUTS */}
      <Text>Enter number of Row and Columns:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={inputSize}
        onChangeText={setInputSize}
      />

      <Text>Enter number of Bombs:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={inputBombs}
        onChangeText={setInputBombs}
      />

      <TouchableOpacity style={styles.button} onPress={generateBoard}>
        <Text style={styles.buttonText}>REGENERATE</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  grid: {
    alignSelf: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    padding: 8,
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 12,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  cell: {
    width: 30,
    height: 30,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cellText: {
    fontSize: 14,
  },
});