import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  Platform,
  TouchableOpacity,
} from "react-native";
import products from "@/assets/product.json"; // Assuming products is an array of products
import { useRouter } from "expo-router";

const ITEMS_PER_PAGE = 20; // Number of items to load per page

export default function AllProducts() {
  const router = useRouter();

  // State to hold currently displayed products
  const [displayedProducts, setDisplayedProducts] = useState([]);

  // State to manage loading state
  const [loading, setLoading] = useState(false);

  // Effect to load the initial set of products
  useEffect(() => {
    loadMoreProducts();
  }, []);

  // Function to load more products
  const loadMoreProducts = () => {
    if (loading) return; // Prevent loading if already loading

    setLoading(true);
    // Get the next set of products
    const nextProducts = products.slice(
      displayedProducts.length,
      displayedProducts.length + ITEMS_PER_PAGE
    );
    setDisplayedProducts((prev) => [...prev, ...nextProducts]); // Add new products to the displayed list
    setLoading(false);
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/ProductDetails",
          params: { product: JSON.stringify(item) }, // Stringify the product
        })
      }
      style={styles.productCard}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productDescription}>{item.description}</Text>
      <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
      <Text style={styles.stockText}>
        {item.inStock ? "In Stock" : "Out of Stock"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={displayedProducts}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        numColumns={Platform.OS === "android" ? 2 : 3}
        onEndReached={loadMoreProducts} // Load more products when reaching the end
        onEndReachedThreshold={0.1} // Threshold to trigger loading more
        ListFooterComponent={
          loading ? <ActivityIndicator style={styles.loadingIndicator} /> : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#fff",
    padding: 10, // Added padding for better spacing
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 10,
  },
  separator: {
    marginVertical: 5,
    height: 1,
    width: "80%",
    backgroundColor: "#ccc",
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
    alignItems: "center",
    width: "48%", // Adjust width for two columns (48% for margin)
    marginHorizontal: "1%", // Add horizontal margin for spacing
  },
  productImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    resizeMode: "contain", // Maintain aspect ratio
  },
  productName: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 5,
    color: "#333",
  },
  productDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2a9d8f", // A pleasant color for price
  },
  stockText: {
    fontSize: 12,
    color: "#e76f51", // A color for stock status
  },
  loadingIndicator: {
    marginVertical: 20,
  },
});
