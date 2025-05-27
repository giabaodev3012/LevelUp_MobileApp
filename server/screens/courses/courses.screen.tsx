import { SERVER_URI } from "@/utils/uri";
import axios from "axios";
import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import {
  useFonts,
  Raleway_700Bold,
  Raleway_600SemiBold,
} from "@expo-google-fonts/raleway";
import {
  Nunito_400Regular,
  Nunito_700Bold,
  Nunito_500Medium,
  Nunito_600SemiBold,
} from "@expo-google-fonts/nunito";
import Loader from "@/components/loader/loader";
import { LinearGradient } from "expo-linear-gradient";
import CourseCard from "@/components/cards/course.card";

export default function CoursesScreen() {
  const [courses, setCourses] = useState<CoursesType[]>([]);
  const [originalCourses, setOriginalCourses] = useState<CoursesType[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setcategories] = useState([]);
  const [activeCategory, setactiveCategory] = useState("All");

  useEffect(() => {
  axios
    .get(`${SERVER_URI}/get-layout/Categories`)
    .then((res) => {
      const layout = res.data?.layout;

      if (layout && layout.categories) {
        setcategories(layout.categories);
        fetchCourses();
      } else {
        console.warn("Categories data is missing or malformed:", layout);
        setcategories([]); // hoặc hiển thị thông báo không có dữ liệu
        setLoading(false); // vẫn phải stop loading
      }
    })
    .catch((error) => {
      console.log("Error fetching categories:", error);
      setLoading(false);
    });
}, []);

const fetchCourses = () => {
  axios
    .get(`${SERVER_URI}/get-courses`)
    .then((res: any) => {
      const rawCourses = res.data.courses || [];

      // Lọc các phần tử null hoặc undefined trước khi lưu
      const cleanedCourses = rawCourses.filter(
        (course: CoursesType | null) => course !== null && course !== undefined
      );

      console.log("Fetched courses:", cleanedCourses); // Kiểm tra kết quả

      setCourses(cleanedCourses);
      setOriginalCourses(cleanedCourses);
      setLoading(false);
    })
    .catch((error) => {
      setLoading(false);
      console.log("Error fetching courses:", error);
    });
};

const handleCategories = (e: string) => {
  setactiveCategory(e);
  if (e === "All") {
    setCourses(originalCourses);
  } else {
    const filtered = originalCourses.filter(
      (i: CoursesType | null) => i?.categories === e
    );
    setCourses(filtered);
  }
};

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <LinearGradient
          colors={["#E5ECF9", "#F6F7F9"]}
          style={{ flex: 1, paddingTop: 65 }}
        >
          <View style={{ padding: 10 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                style={{
                  padding: 10,
                  backgroundColor:
                    activeCategory === "All" ? "#2467EC" : "#000",
                  borderRadius: 20,
                  paddingHorizontal: 20,
                  marginRight: 5,
                }}
                onPress={() => handleCategories("All")}
              >
                <Text
                  style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}
                >
                  All
                </Text>
              </TouchableOpacity>
              {categories?.map((i: any, index: number) => (
                <TouchableOpacity
                  style={{
                    padding: 10,
                    backgroundColor:
                      activeCategory === i?.title ? "#2467EC" : "#000",
                    borderRadius: 50,
                    paddingHorizontal: 20,
                    marginHorizontal: 15,
                  }}
                  onPress={() => handleCategories(i?.title)}
                >
                  <Text
                    style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}
                  >
                    {i?.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <View>
            <ScrollView style={{ marginHorizontal: 15, gap: 12 }}>
              {courses?.map((item: CoursesType, index: number) => (
                <CourseCard item={item} key={index} />
              ))}
            </ScrollView>
            {courses?.length === 0 && (
              <Text
                style={{ textAlign: "center", paddingTop: 50, fontSize: 18 }}
              >
                No data available!
              </Text>
            )}
          </View>
        </LinearGradient>
      )}
    </>
  );
}
