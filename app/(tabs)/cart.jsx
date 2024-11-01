import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";

export default function CartScreen() {
  const [cartItems, setCartItems] = useState([]);

  // Function to fetch cart items from AsyncStorage
  const fetchCartItems = async () => {
    try {
      const cart = await AsyncStorage.getItem("cart");
      const items = cart ? JSON.parse(cart) : [];
      setCartItems(items);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  // Fetch cart items whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchCartItems();
    }, [])
  );

  // Function to handle removal of items from the cart
  const handleRemoveItem = async (productId) => {
    try {
      const updatedCart = cartItems.filter(
        (item) => item["Product ID"] !== productId
      );
      setCartItems(updatedCart);
      await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
      Alert.alert("Item removed from cart.");
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  // Function to render each cart item
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/ProductDetails",
          params: { product: JSON.stringify(item) }, // Stringify the product
        })
      }
      style={styles.cartItem}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.infoContainer}>
        <Text style={styles.productName}>{item["Product Name"]}</Text>
        <Text style={styles.productPrice}>
          ${parseFloat(item["Price"]).toFixed(2)}
        </Text>
        <Text style={styles.productQuantity}>Quantity: {item.quantity}</Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveItem(item["Product ID"])}
      >
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {cartItems.length > 0 ? (
        <FlatList
          data={cartItems}
          renderItem={renderItem}
          keyExtractor={(item) => item["Product ID"].toString()}
        />
      ) : (
        <Text style={styles.emptyCartText}>Your cart is empty.</Text>
      )}
    </View>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  emptyCartText: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  productPrice: {
    fontSize: 16,
    color: "#2a9d8f",
    marginBottom: 5,
  },
  productQuantity: {
    fontSize: 14,
    color: "#555",
  },
  removeButton: {
    backgroundColor: "#ff4d4d",
    padding: 8,
    borderRadius: 5,
  },
  removeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cartbutton: {
    backgroundColor: "transparent",
    borderColor: "#2a9d8f",
    borderWidth: 2,
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
});
