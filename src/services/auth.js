import api from "../utils/request";

// Cache biến để tránh gọi API nhiều lần
let profileCache = null;
let profileFetchedAt = null;
const PROFILE_CACHE_TIME = 5 * 60 * 1000; // 5 phút

// API đăng ký
export const register = async (userData) => {
  try {
    const response = await api.post("/auth/register", {
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      gender: userData.gender,
      address: userData.address,
      status: userData.status || "active",
      role: userData.role || "customer",
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// API đăng nhập
export const login = async (credentials) => {
  try {
    const response = await api.post("/auth/login", {
      email: credentials.email,
      password: credentials.password,
    });

    console.log("API Login response:", response);

    // Reset cache khi đăng nhập
    profileCache = null;
    profileFetchedAt = null;

    // Lưu token và user info vào localStorage
    if (response && response.token) {
      localStorage.setItem("token", response.token);

      // Xử lý dữ liệu người dùng
      let userData = {};

      // Kiểm tra có dữ liệu user không
      if (response.user) {
        userData = { ...response.user };
      } else if (response.data && response.data.user) {
        userData = { ...response.data.user };
      } else {
        // Trường hợp response chứa thông tin user trực tiếp
        userData = { ...response };
        delete userData.token; // Không lưu token vào đối tượng user
      }

      if (!userData.id) {
        if (userData.userId) userData.id = userData.userId;
        else if (userData._id) userData.id = userData._id;
        else if (response.userId) userData.id = response.userId;
        else if (response._id) userData.id = response._id;
      }

      // Đảm bảo có userId cho compatibility
      if (!userData.userId && userData.id) {
        userData.userId = userData.id;
      }

      // Đảm bảo có các thông tin cơ bản
      if (!userData.email && credentials.email) {
        userData.email = credentials.email;
      }

      if (userData.id && !userData.id.toString().match(/^\d{13}$/)) {
        console.log("Saving user data to localStorage:", userData);
        localStorage.setItem("user", JSON.stringify(userData));

        // Cập nhật cache
        profileCache = userData;
        profileFetchedAt = Date.now();
      } else {
        console.log("No real user ID found, will fetch from profile API");
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: userData.email || credentials.email,
            name: userData.name,
            needsProfileFetch: true,
          })
        );
      }
    } else {
      console.error("Login response is missing token or invalid:", response);
      throw new Error("Invalid response format from server");
    }

    return response;
  } catch (error) {
    throw error;
  }
};

// API đăng xuất
export const logout = async () => {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // Xóa token và user info khỏi localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Reset cache
    profileCache = null;
    profileFetchedAt = null;
  }
};

// API quên mật khẩu
export const forgotPassword = async (email) => {
  try {
    const response = await api.post("/auth/forgot-password", {
      email: email,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// API reset mật khẩu (dùng cho quên mật khẩu)
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post("/auth/reset-password", {
      token: token,
      newPassword: newPassword,
    });

    // Reset cache sau khi đổi mật khẩu thành công
    profileCache = null;
    profileFetchedAt = null;

    return response;
  } catch (error) {
    throw error;
  }
};

// API đổi mật khẩu (khi đã đăng nhập)
export const changePassword = async (oldPassword, newPassword) => {
  try {
    const response = await api.post("/auth/change-password", {
      oldPassword: oldPassword,
      newPassword: newPassword,
    });

    // Reset cache sau khi đổi mật khẩu thành công
    profileCache = null;
    profileFetchedAt = null;

    return response;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};

// API lấy thông tin profile qua token
export const getProfile = async (forceRefresh = false) => {
  try {
    // Kiểm tra cache còn hạn sử dụng không
    const now = Date.now();
    const isCacheValid =
      profileCache &&
      profileFetchedAt &&
      now - profileFetchedAt < PROFILE_CACHE_TIME;

    // Nếu cache còn hạn và không yêu cầu refresh, trả về cache
    if (isCacheValid && !forceRefresh) {
      console.log("Returning cached profile data");
      return profileCache;
    }

    // Không có cache hoặc cache hết hạn, gọi API
    console.log("Fetching fresh profile data from API");
    const response = await api.get("/auth/profile");

    // Cập nhật cache
    profileCache = response;
    profileFetchedAt = now;

    return response;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

// Lấy thông tin user hiện tại (từ API hoặc localStorage)
export const getCurrentUser = async (options = { forceRefresh: false }) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found, skipping profile fetch");
      return null;
    }

    // Kiểm tra localStorage trước để xem có cần fetch từ API không
    const userStr = localStorage.getItem("user");
    let needsProfileFetch = false;

    if (userStr) {
      try {
        const storedUser = JSON.parse(userStr);
        // Nếu user có flag needsProfileFetch hoặc không có ID thực
        if (
          storedUser.needsProfileFetch ||
          !storedUser.id ||
          storedUser.id.toString().match(/^\d{13}$/)
        ) {
          needsProfileFetch = true;
        }
      } catch (e) {
        needsProfileFetch = true;
      }
    } else {
      needsProfileFetch = true;
    }

    // Luôn fetch từ API nếu forceRefresh hoặc cần profile fetch hoặc chưa có cache
    if (options.forceRefresh || needsProfileFetch || !profileCache) {
      try {
        console.log("Fetching user data from profile API...");
        const profileData = await getProfile(options.forceRefresh);

        // Kiểm tra và chuẩn hóa dữ liệu
        if (profileData && typeof profileData === "object") {
          const userData = { ...profileData };

          // Đảm bảo dữ liệu người dùng chứa id
          if (!userData.id) {
            if (userData.userId) userData.id = userData.userId;
            else if (userData._id) userData.id = userData._id;
          }

          // Đảm bảo có userId cho compatibility
          if (!userData.userId && userData.id) {
            userData.userId = userData.id;
          }

          // Xóa flag needsProfileFetch nếu có
          delete userData.needsProfileFetch;

          console.log("Profile data fetched successfully:", userData);

          // Cập nhật localStorage với dữ liệu mới nhất từ API
          localStorage.setItem("user", JSON.stringify(userData));

          // Cập nhật cache
          profileCache = userData;
          profileFetchedAt = Date.now();

          return userData;
        }
      } catch (apiError) {
        console.error("Could not fetch profile from API:", apiError);

        // Nếu không fetch được từ API và đây là lần đầu sau login, thì fail
        if (needsProfileFetch) {
          throw apiError;
        }
      }
    } else {
      return profileCache;
    }

    // Fallback: Lấy từ localStorage nếu API không thành công và không cần profile fetch
    if (!needsProfileFetch && userStr) {
      let user;
      try {
        user = JSON.parse(userStr);
      } catch (e) {
        console.error("Failed to parse user JSON:", e);
        return null;
      }

      console.log("Retrieved user data from localStorage:", user);

      // Đảm bảo dữ liệu người dùng chứa id thực
      if (!user.id || user.id.toString().match(/^\d{13}$/)) {
        console.log("User ID is fake or missing, need to fetch from API");
        return null;
      }

      // Đảm bảo có userId cho compatibility
      if (!user.userId && user.id) {
        user.userId = user.id;
        localStorage.setItem("user", JSON.stringify(user));
      }

      // Cập nhật cache từ localStorage nếu chưa có
      if (!profileCache) {
        profileCache = user;
        profileFetchedAt = Date.now();
      }

      return user;
    }

    console.log("No valid user data found");
    return null;
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};

// Kiểm tra xem user có đăng nhập hay không
export const isAuthenticated = async () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    // Kiểm tra token có hợp lệ không bằng cách lấy thông tin người dùng
    const user = await getCurrentUser({ forceRefresh: false });
    return !!user && !!user.id && !user.id.toString().match(/^\d{13}$/);
  } catch (error) {
    console.error("Authentication check failed:", error);
    return false;
  }
};

// Lấy token từ localStorage
export const getToken = () => {
  return localStorage.getItem("token");
};
