import React from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';

export function Evnt({ events }) {
  return (
    <FlatList
      data={events}
      renderItem={({ item, index }) => (
        <View style={styles.listItem}>
          <Text>{item}</Text>
        </View>
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  );
}

const styles = StyleSheet.create({
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});


// import React from 'react';

// export function Events({ events }) {
//   return (
//     <ul>
//     {
//       events.map((event, index) =>
//         <li key={ index }>{ event }</li>
//       )
//     }
//     </ul>
//   );
// }