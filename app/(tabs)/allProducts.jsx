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
import productData from "../../assets/products.json"; // Assuming this is your new product data
import stockData from "../../assets/stock.json"; // Assuming this is your new stock data
import { useRouter } from "expo-router";

const ITEMS_PER_PAGE = 20; // Number of items to load per page

export default function AllProducts() {
  const router = useRouter();

  // State to hold currently displayed products
  const [displayedProducts, setDisplayedProducts] = useState([]);
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
    const nextProducts = productData.slice(
      displayedProducts.length,
      displayedProducts.length + ITEMS_PER_PAGE
    );

    // Add stock information to the products
    const updatedProducts = nextProducts.map((product) => {
      const stockInfo = stockData.find(
        (stock) => stock["Product ID"] === product["Product ID"]
      );
      return {
        ...product,
        inStock: stockInfo ? stockInfo["Stock Available"] === "TRUE" : false, // Determine stock status
      };
    });

    setDisplayedProducts((prev) => [...prev, ...updatedProducts]); // Add new products to the displayed list
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
      <Text style={styles.productName}>{item["Product Name"]}</Text>
      <Text style={styles.productPrice}>
        ${parseFloat(item["Price"]).toFixed(2)}
      </Text>
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
        keyExtractor={(item) => item["Product ID"].toString()}
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
    padding: 10,
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
    elevation: 3,
    alignItems: "center",
    width: "48%",
    marginHorizontal: "1%",
  },
  productImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    resizeMode: "contain",
  },
  productName: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 5,
    color: "#333",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2a9d8f",
  },
  stockText: {
    fontSize: 12,
    color: "#e76f51",
  },
  loadingIndicator: {
    marginVertical: 20,
  },
});
