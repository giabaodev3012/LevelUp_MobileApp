import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function CourseCard({ item }: { item: CoursesType }) {
  return (
    // Sử dụng TouchableOpacity để có hiệu ứng nhấn
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        router.push({
          pathname: "/(routes)/course-details",
          params: { item: JSON.stringify(item) },
        })
      }
    >
      <View style={{ paddingHorizontal: 10 }}>
        <Image
          style={styles.thumbnailImage}
          source={{ uri: item.thumbnail.url }}
        />
        <View style={{ width: wp(85) }}>
          <Text style={styles.courseName}>{item.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.ratingBadge}>
            <FontAwesome name="star" size={14} color={"#FFD700"} />
            <Text style={styles.ratingText}>{item?.ratings}</Text>
          </View>
          <Text style={styles.studentsText}>
            {item.purchased} Students
          </Text>
        </View>
        <View style={styles.priceAndLecturesRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.currentPrice}>${item?.price}</Text>
            {item?.estimatedPrice && ( // Chỉ hiển thị nếu có estimatedPrice
              <Text style={styles.estimatedPrice}>
                ${item?.estimatedPrice}
              </Text>
            )}
          </View>
          <View style={styles.lecturesContainer}>
            <Ionicons name="list-outline" size={20} color={"#8A8A8A"} />
            <Text style={styles.lecturesText}>
              {item.courseData.length} Lectures
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF", // Nền trắng sáng
    marginHorizontal: 8, // Tăng nhẹ margin để card có không gian thở
    borderRadius: 15, // Bo tròn nhiều hơn cho cảm giác mềm mại
    width: wp(90), // Chiều rộng cố định để dễ quản lý hơn
    height: "auto",
    overflow: "hidden",
    alignSelf: "center", // Căn giữa card
    marginVertical: 15,
    padding: 10, // Tăng padding tổng thể
    // Thêm bóng đổ đẹp hơn cho Android và iOS
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 6, // Tăng elevation cho Android
      },
    }),
  },
  thumbnailImage: {
    width: "100%", // Chiếm toàn bộ chiều rộng của padding container
    height: 200, // Chiều cao cố định
    borderRadius: 10, // Bo tròn ảnh
    alignSelf: "center",
    objectFit: "cover",
    marginBottom: 10, // Thêm khoảng cách dưới ảnh
  },
  courseName: {
    fontSize: 16, // Kích thước chữ lớn hơn một chút
    textAlign: "left",
    marginBottom: 8, // Khoảng cách dưới tên khóa học
    fontFamily: "Raleway_600SemiBold",
    color: "#333333", // Màu chữ tối hơn cho dễ đọc
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 9, // Khoảng cách dưới hàng thông tin
  },
  ratingBadge: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2E3A59",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    gap: 4,
    height: 30, // Chiều cao cố định cho badge
  },
  ratingText: {
    color: "#FFFFFF", // Màu chữ trắng cho dễ nhìn trên nền xanh đậm
    fontSize: 13,
    fontWeight: "600", // Tăng độ đậm cho chữ
  },
  studentsText: {
    fontSize: 13,
    color: "#666666", // Màu xám nhẹ nhàng hơn
  },
  priceAndLecturesRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 5, // Khoảng cách trên
    paddingBottom: 5,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline", // Căn chỉnh theo baseline để giá có gạch ngang không bị lệch
  },
  currentPrice: {
    fontSize: 20, // Kích thước giá lớn hơn
    fontWeight: "700", // Rất đậm
    color: "#007BFF", // Màu xanh dương nổi bật cho giá hiện tại
    marginRight: 5, // Khoảng cách giữa giá hiện tại và giá gạch ngang
  },
  estimatedPrice: {
    fontSize: 15,
    fontWeight: "400",
    color: "#999999", // Màu xám nhạt hơn cho giá gạch ngang
    textDecorationLine: "line-through",
  },
  lecturesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  lecturesText: {
    marginLeft: 5,
    fontSize: 13, // Kích thước chữ nhỏ hơn một chút
    color: "#666666",
  },
});
