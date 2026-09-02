import React from 'react';
import {FlatList, Text, View, StyleSheet ,
  Platform} from 'react-native';

export function Evnt({ events = [] }) {
  return (
    <FlatList
      data={events}
      keyExtractor={(item, index) =>
        typeof item === 'string' || typeof item === 'number'
          ? `${item}-${index}`
          : index.toString()
      }
      renderItem={({ item }) => (
        <View style={styles.listItem}>
          <Text style={styles.itemText}>{item}</Text>
        </View>
      )}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No events available.</Text>
        </View>
      }
    />
  );
}

export const Events = Evnt;

const styles = StyleSheet.create({
  listItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 15,
    color: '#333',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#888',
  },
});