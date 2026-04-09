import { create } from "zustand";

export const useOrderStore = create(() => ({
  isOrderDialogOpen: false,
  isUpdateOrderProductDialogOpen: false,
  isUpdateOrderStatusDialogOpen: false,
  isPublishShipmentDialogOpen: false,
  isDeleteOrderDialogOpen: false,
  isAssignUsers: false,

  selectedOrder: null,
  orderDetails: {},
  productsOrder: [],
  sortType: null,
  sortBy: null,
  dateAdded: null,
  dateModified: null,
  search: "",
  status: null,
  paymentType: null,
  isFilterMenu: false,
  debouncedSearchValue: null,
  selectedCity: null,
  page: 1,
  itemPerPage: "25",
  searchBy: "filter_by_order_id",
  rangeDate: null,
}));

export const setIsOrderDialogOpen = (value) =>
  useOrderStore.setState({ isOrderDialogOpen: value });
export const setIsUpdateOrderProductDialogOpen = (value) =>
  useOrderStore.setState({ isUpdateOrderProductDialogOpen: value });
export const setIsUpdateOrderStatusDialogOpen = (value) =>
  useOrderStore.setState({ isUpdateOrderStatusDialogOpen: value });
export const setIsPublishShipmentDialogOpenDialogOpen = (value) =>
  useOrderStore.setState({ isPublishShipmentDialogOpen: value });
export const setIsDeleteOrderDialogOpen = (value) =>
  useOrderStore.setState({ isDeleteOrderDialogOpen: value });
export const setIsAssignUsersDialog = (value) =>
  useOrderStore.setState({ isAssignUsers: value });

export const setSelectedOrder = (value) =>
  useOrderStore.setState({ selectedOrder: value });
export const setSelectedCity = (value) =>
  useOrderStore.setState({ selectedCity: value });
export const setOrderDetails = (value) =>
  useOrderStore.setState({ orderDetails: value });
export const setProductsOrder = (value) =>
  useOrderStore.setState({ productsOrder: value });

export const setSortType = (value) =>
  useOrderStore.setState({ sortType: value });
export const setSortBy = (value) => useOrderStore.setState({ sortBy: value });
export const clearSortValue = () =>
  useOrderStore.setState({ sortBy: null, sortType: null });
export const setSearch = (value) => useOrderStore.setState({ search: value });
export const setDebouncedSearchValue = (value) =>
  useOrderStore.setState({ debouncedSearchValue: value });
export const setPage = (value) => useOrderStore.setState({ page: value });
export const setItemPerPage = (value) =>
  useOrderStore.setState({ itemPerPage: value });
export const setSearchBy = (value) =>
  useOrderStore.setState({ searchBy: value });

export const setDateAdded = (value) =>
  useOrderStore.setState({ dateAdded: value });
export const setDateModified = (value) =>
  useOrderStore.setState({ dateModified: value });
export const setStatus = (value) => useOrderStore.setState({ status: value });
export const setPaymentType = (value) =>
  useOrderStore.setState({ paymentType: value });

export const setIsFilterMenu = (value) =>
  useOrderStore.setState({ isFilterMenu: value });
export const setRangeDate = (value) =>
  useOrderStore.setState({ rangeDate: value });
export const ClearFilters = () =>
  useOrderStore.setState({
    rangeDate: null,
    paymentType: null,
    debouncedSearchValue: null,
    status: null,
    search: "",
    selectedCity: null,
    searchBy: "filter_by_order_id",
  });

export const iraqCities = [
  {
    name: "Al Anbar",
    name_ar: "الانبار",
    postcode: 1580,
  },
  {
    name: "Al Basrah",
    name_ar: "البصرة",
    postcode: 1573,
  },
  {
    name: "Al Karbala",
    name_ar: "كربلاء",
    postcode: 1578,
  },
  {
    name: "Al Muthanna",
    name_ar: "المثنى",
    postcode: 1575,
  },
  {
    name: "Al Qadisyah",
    name_ar: "القادسية",
    postcode: 1576,
  },
  {
    name: "Al Najaf",
    name_ar: "النجف",
    postcode: 1579,
  },
  {
    name: "Erbil",
    name_ar: "اربيل",
    postcode: 1583,
  },
  {
    name: "Sulaymaniyah",
    name_ar: "السليمانية",
    postcode: 1585,
  },
  {
    name: "Kirkuk",
    name_ar: "كركوك",
    postcode: 1584,
  },
  {
    name: "Babil",
    name_ar: "بابل",
    postcode: 1577,
  },
  {
    name: "Baghdad",
    name_ar: "بغداد",
    postcode: 1568,
  },
  {
    name: "Dahuk",
    name_ar: "دهوك",
    postcode: 1582,
  },
  {
    name: "Dhi Qar",
    name_ar: "ذي قار",
    postcode: 1574,
  },
  {
    name: "Diyala",
    name_ar: "ديالى",
    postcode: 1570,
  },
  {
    name: "Maysan",
    name_ar: "ميسان",
    postcode: 1572,
  },
  {
    name: "Ninawa",
    name_ar: "نينوى",
    postcode: 1581,
  },
  {
    name: "Salah ad Din",
    name_ar: "صلاح الدين",
    postcode: 1569,
  },
  {
    name: "Wasit",
    name_ar: "واسط",
    postcode: 1571,
  },
  {
    name: "Halabjah",
    name_ar: "حلبجة",
    postcode: 1586,
  },
  {
    name: "Zakho",
    name_ar: "زاخو",
    postcode: 1587,
  },
];

export const baghdadAreas = [
  {
    id: 32,
    arabic_name: "شارع 42/52/62",
    english_name: "42/52/62 street",
  },
  {
    id: 3,
    arabic_name: "سبع ابكار",
    english_name: "7 Abkar",
  },
  {
    id: 53,
    arabic_name: "ابو تشير",
    english_name: "Abu Tashir",
  },
  {
    id: 1,
    arabic_name: "الاعظمية",
    english_name: "Al-Adhamiya",
  },
  {
    id: 59,
    arabic_name: "العلاوي",
    english_name: "Al-Alawi",
  },
  {
    id: 25,
    arabic_name: "الامين الثانية",
    english_name: "Al-Amin 2nd",
  },
  {
    id: 71,
    arabic_name: "الاساتذة",
    english_name: "Al-Asatidhah",
  },
  {
    id: 63,
    arabic_name: "العطيفية",
    english_name: "Al-Ataifiyah",
  },
  {
    id: 22,
    arabic_name: "البلديات",
    english_name: "Al-Baladiyat",
  },
  {
    id: 39,
    arabic_name: "البتاوين",
    english_name: "Al-Bataween",
  },
  {
    id: 49,
    arabic_name: "البياع",
    english_name: "Al-Bayaa",
  },
  {
    id: 69,
    arabic_name: "البيجي",
    english_name: "Al-Biji",
  },
  {
    id: 83,
    arabic_name: "البكرية",
    english_name: "Al-Bukriyah",
  },
  {
    id: 13,
    arabic_name: "البنوك",
    english_name: "Al-Bunuk",
  },
  {
    id: 46,
    arabic_name: "الدورة",
    english_name: "Al-Dawrah",
  },
  {
    id: 42,
    arabic_name: "الفضل",
    english_name: "Al-Fadl",
  },
  {
    id: 23,
    arabic_name: "الغدير",
    english_name: "Al-Ghadeer",
  },
  {
    id: 18,
    arabic_name: "الحبيبية",
    english_name: "Al-Habibiyah",
  },
  {
    id: 51,
    arabic_name: "الحارثية",
    english_name: "Al-Harthiyah",
  },
  {
    id: 100,
    arabic_name: "الحسينية",
    english_name: "Al-Husayniyya",
  },
  {
    id: 90,
    arabic_name: "الإعلام",
    english_name: "Al-I'lam",
  },
  {
    id: 66,
    arabic_name: "الاسكان",
    english_name: "Al-Iskan",
  },
  {
    id: 41,
    arabic_name: "الجادرية",
    english_name: "Al-Jadriyah",
  },
  {
    id: 52,
    arabic_name: "الجادرية",
    english_name: "Al-Jadriyah",
  },
  {
    id: 72,
    arabic_name: "الكاظمية",
    english_name: "Al-Kadhimiya",
  },
  {
    id: 6,
    arabic_name: "الكسرة",
    english_name: "Al-Kasrah",
  },
  {
    id: 58,
    arabic_name: "المنطقه الخضراء",
    english_name: "Al-Khadra'",
  },
  {
    id: 36,
    arabic_name: "الكفاح",
    english_name: "Al-Kifah",
  },
  {
    id: 7,
    arabic_name: "شارع المغرب",
    english_name: "Al-Maghrib street",
  },
  {
    id: 99,
    arabic_name: "المحمودية",
    english_name: "Al-Mahmudiyya",
  },
  {
    id: 55,
    arabic_name: "المنصور",
    english_name: "Al-Mansour",
  },
  {
    id: 24,
    arabic_name: "المشتل",
    english_name: "Al-Mashtal",
  },
  {
    id: 48,
    arabic_name: "المنحانية",
    english_name: "Al-Munhaniyah",
  },
  {
    id: 28,
    arabic_name: "النعيرية",
    english_name: "Al-Na'iriyah",
  },
  {
    id: 50,
    arabic_name: "القادسية",
    english_name: "Al-Qadisiyah",
  },
  {
    id: 5,
    arabic_name: "القاهرة",
    english_name: "Al-Qahirah",
  },
  {
    id: 9,
    arabic_name: "صدر القناة",
    english_name: "Al-Qanat",
  },
  {
    id: 94,
    arabic_name: "الري",
    english_name: "Al-Ray",
  },
  {
    id: 92,
    arabic_name: "الرسالة",
    english_name: "Al-Risalah",
  },
  {
    id: 31,
    arabic_name: "بارك السعدون",
    english_name: "Al-Sa'adoun Park",
  },
  {
    id: 34,
    arabic_name: "السعدون",
    english_name: "Al-Sa'adun",
  },
  {
    id: 16,
    arabic_name: "مدينه الصدر",
    english_name: "Al-Sadr",
  },
  {
    id: 60,
    arabic_name: "الصالحية",
    english_name: "Al-Salihiyah",
  },
  {
    id: 38,
    arabic_name: "السنك",
    english_name: "Al-Sanak",
  },
  {
    id: 91,
    arabic_name: "السيدية",
    english_name: "Al-Sayyidiyah",
  },
  {
    id: 11,
    arabic_name: "الشعب",
    english_name: "Al-Sha'ab",
  },
  {
    id: 93,
    arabic_name: "الشباب",
    english_name: "Al-Shabab",
  },
  {
    id: 64,
    arabic_name: "الشالجية",
    english_name: "Al-Shaljihiyah",
  },
  {
    id: 96,
    arabic_name: "الشرطةالرابعة",
    english_name: "Al-Shurtah 4th",
  },
  {
    id: 43,
    arabic_name: "الشرطه الخامسة",
    english_name: "Al-Shurtah 5th",
  },
  {
    id: 33,
    arabic_name: "شارع الصناعة",
    english_name: "Al-Sinaa street",
  },
  {
    id: 2,
    arabic_name: "الصليخ",
    english_name: "Al-Sulaykh",
  },
  {
    id: 14,
    arabic_name: "الطالبية",
    english_name: "Al-Talibiyah",
  },
  {
    id: 81,
    arabic_name: "الطي",
    english_name: "Al-Tayy",
  },
  {
    id: 67,
    arabic_name: "الطوبجي",
    english_name: "Al-Tubaji",
  },
  {
    id: 95,
    arabic_name: "التراث",
    english_name: "Al-Turath",
  },
  {
    id: 65,
    arabic_name: "الوشاش",
    english_name: "Al-Washash",
  },
  {
    id: 8,
    arabic_name: "الوزيرية",
    english_name: "Al-Waziriyah",
  },
  {
    id: 54,
    arabic_name: "اليرموك",
    english_name: "Al-Yarmuk",
  },
  {
    id: 29,
    arabic_name: "الزعفرانية",
    english_name: "Al-Za'faraniyah",
  },
  {
    id: 68,
    arabic_name: "علي الصالح",
    english_name: "Ali al-Salih",
  },
  {
    id: 78,
    arabic_name: "العامرية",
    english_name: "Amariyah",
  },
  {
    id: 98,
    arabic_name: "عرب جبور",
    english_name: "Arab Jubur",
  },
  {
    id: 35,
    arabic_name: "باب المعظم",
    english_name: "Bab al-Mu'azzam",
  },
  {
    id: 37,
    arabic_name: "باب الشرجي",
    english_name: "Bab al-Sharji",
  },
  {
    id: 26,
    arabic_name: "بغداد الجديدة",
    english_name: "Baghdad al-Jadidah",
  },
  {
    id: 101,
    arabic_name: "بسماية",
    english_name: "Bismaya",
  },
  {
    id: 79,
    arabic_name: "الدولعي",
    english_name: "Dula'i",
  },
  {
    id: 77,
    arabic_name: "غزالية",
    english_name: "Ghazaliyah",
  },
  {
    id: 57,
    arabic_name: "حي العدل",
    english_name: "Hayy al-Adl",
  },
  {
    id: 19,
    arabic_name: "حي الامانة",
    english_name: "Hayy al-Amanah",
  },
  {
    id: 47,
    arabic_name: "حي العامل",
    english_name: "Hayy al-Amil",
  },
  {
    id: 86,
    arabic_name: "حي الأطباء",
    english_name: "Hayy al-Atibba'",
  },
  {
    id: 10,
    arabic_name: "حي البساتين",
    english_name: "Hayy al-Basateen",
  },
  {
    id: 70,
    arabic_name: "حي حطين",
    english_name: "Hayy al-Hittin",
  },
  {
    id: 87,
    arabic_name: "حي الحسين",
    english_name: "Hayy al-Husayn",
  },
  {
    id: 56,
    arabic_name: "حي الجامعة",
    english_name: "Hayy al-Jami'ah",
  },
  {
    id: 85,
    arabic_name: "حي الجهاد",
    english_name: "Hayy al-Jihad",
  },
  {
    id: 84,
    arabic_name: "حي الخضراء",
    english_name: "Hayy al-Khadra'",
  },
  {
    id: 80,
    arabic_name: "حي السلام",
    english_name: "Hayy al-Salam",
  },
  {
    id: 4,
    arabic_name: "حي تونس",
    english_name: "Hayy Tunis",
  },
  {
    id: 12,
    arabic_name: "حي اور",
    english_name: "Hayy Ur",
  },
  {
    id: 97,
    arabic_name: "هور رجب",
    english_name: "Hur Rajab",
  },
  {
    id: 73,
    arabic_name: "الحرية",
    english_name: "Hurriyah",
  },
  {
    id: 82,
    arabic_name: "جكوك",
    english_name: "Jakoouk",
  },
  {
    id: 15,
    arabic_name: "جميلة",
    english_name: "Jamilah",
  },
  {
    id: 76,
    arabic_name: "الجوادين",
    english_name: "Jawadain",
  },
  {
    id: 44,
    arabic_name: "كفائات السيدية",
    english_name: "Kafa'at al-Sayidiyah",
  },
  {
    id: 45,
    arabic_name: "كفائات الصحة",
    english_name: "Kafa'at al-Sihha",
  },
  {
    id: 40,
    arabic_name: "كرادة",
    english_name: "Karrada",
  },
  {
    id: 75,
    arabic_name: "خطيب",
    english_name: "Khateeb",
  },
  {
    id: 102,
    arabic_name: "اخرى",
    english_name: "others",
  },
  {
    id: 20,
    arabic_name: "شارع فلسطين",
    english_name: "Palestine street",
  },
  {
    id: 61,
    arabic_name: "رحمانيه الجعيفر",
    english_name: "Rahmaniyah al-Ja'ifar",
  },
  {
    id: 62,
    arabic_name: "رحمانيه الشعلة",
    english_name: "Rahmaniyah al-Shu'lah",
  },
  {
    id: 27,
    arabic_name: "سكينة",
    english_name: "Sakina",
  },
  {
    id: 30,
    arabic_name: "كمب سارة",
    english_name: "Sara Camp",
  },
  {
    id: 74,
    arabic_name: "الشعلة",
    english_name: "Shu'lah",
  },
  {
    id: 88,
    arabic_name: "شهداء البياع",
    english_name: "Shuhada al-Bayaa",
  },
  {
    id: 89,
    arabic_name: "شهداء السيدية",
    english_name: "Shuhada al-Sayidiyah",
  },
  {
    id: 17,
    arabic_name: "ام الكبر والغزلان",
    english_name: "Umm al-Kibar & al-Ghuzlan",
  },
  {
    id: 21,
    arabic_name: "زيونة",
    english_name: "Ziyunah",
  },
];
