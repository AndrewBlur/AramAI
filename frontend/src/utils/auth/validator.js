export const validateForm = (formData, profilePic) => {
  const newErrors = {};
  
  if (!formData.firstName) {
    newErrors.firstName = "First name is required";
  } else if (!/^[A-Za-z]{3,30}$/.test(formData.firstName)) {
    newErrors.firstName = "First name must be 3–30 letters";
  }

  if (!formData.lastName) {
    newErrors.lastName = "Last name is required";
  } else if (!/^[A-Za-z]{1,30}$/.test(formData.lastName)) {
    newErrors.lastName = "Last name must be 1–30 letters";
  }
  if (!formData.email) {
    newErrors.email = "Email is required";
  } else if (formData.email.length > 50) {
    newErrors.email = "Email must be under 50 characters";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    newErrors.email = "Enter a valid email address";
  }

  if (!formData.mobile) {
    newErrors.mobile = "Mobile number is required";
  } else if (!/^\d{10}$/.test(formData.mobile)) {
    newErrors.mobile = "Mobile number must be exactly 10 digits";
  }

  if (!formData.age) {
    newErrors.age = "Age is required";
  } else if (isNaN(formData.age)) {
    newErrors.age = "Age must be a number";
  } else if (Number(formData.age) < 18) {
    newErrors.age = "Age must be 18 or above";
  } else if (Number(formData.age) > 120) {
    newErrors.age = "Enter a valid age (<= 120)";
  }
  if (!formData.password) {
    newErrors.password = "Password is required";
  } else if (
    !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(formData.password)
  ) {
    newErrors.password =
      "Password must be at least 8 characters long and include at least one letter, one number, and one special character";
  }

  if (!formData.confirmPassword) {
    newErrors.confirmPassword = "Confirm Password is required";
  } else if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = "Passwords do not match";
  }
  if (formData.role === "lawyer" && !profilePic) {
    newErrors.profilePic = "Profile picture is required for lawyers";
  }

  return newErrors;
};