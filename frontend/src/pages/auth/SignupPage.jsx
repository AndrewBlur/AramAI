import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateForm as validate } from "@/utils/auth/validator";
import ErrorMessage from "@/components/ErrorMessage";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    mobile: "",
    age: "",
    confirmPassword: "",
    role: "user",
  });

  const [newErrors, setNewErrors] = useState({});
  const [profilePic, setProfilePic] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { isSigningUp , signup }  =useAuthStore();

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlockPaste = (e) => {
    e.preventDefault();
  };

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 15 MB in bytes

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setNewErrors((prev) => ({
          ...prev,
          profilePic: "File size must be less than 5 MB",
        }));
        setProfilePic(null);
      } else {
        setNewErrors((prev) => {
          const { profilePic, ...rest } = prev;
          return rest; // clear previous error
        });
        setProfilePic(file);
        console.log("Selected file:", file);
      }
    }
  };


  const validateForm = () => {
    const newErrorst = validate(formData, profilePic);
    setNewErrors(newErrorst || {});
    return Object.keys(newErrors).length === 0;
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const data = new FormData();
      for (let key in formData) {
        data.append(key, formData[key]);
      }
      if (profilePic) {
        data.append("profilePic", profilePic);
      }
      data.delete("confirmPassword");

      const response = await signup(data);
      if(response.ok){
      navigate('/login');
      }
      else if(response.email){
          setNewErrors((prev)=> ({...prev,email : response.email}));
      }
      else if(response.mobile){
          setNewErrors((prev)=> ({...prev,mobile : response.mobile}));
      }
      else{
        setNewErrors((prev)=> ({...prev,message : response.message}));
      }

    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--clr-bg-main)] px-6">
      <div className="w-full max-w-2xl rounded-[var(--corner-lg)] bg-[var(--clr-card-bg)] p-8 shadow-[var(--shadow-md)]">
        {/* Heading */}
        <h1
          className="mb-6 text-center text-3xl font-bold"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <span className="text-gradient-onboarding-light dark:text-gradient-onboarding-dark">
            Create Account
          </span>
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="relative col-span-1">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full rounded-[var(--corner-md)] border border-[var(--clr-border)] bg-[var(--clr-bg-alt)] px-4 py-3 text-[var(--clr-text-main)] placeholder-[var(--clr-text-subtle)] focus:border-[var(--clr-primary-main)] focus:outline-none focus:ring-2 focus:ring-[var(--clr-emerald-main)]"
            />
            {newErrors.firstName && <ErrorMessage message={newErrors.firstName} />}
          </div>


          {/* Last Name */}
          <div className="relative col-span-1">
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full rounded-[var(--corner-md)] border border-[var(--clr-border)] bg-[var(--clr-bg-alt)] px-4 py-3 text-[var(--clr-text-main)] placeholder-[var(--clr-text-subtle)] focus:border-[var(--clr-primary-main)] focus:outline-none focus:ring-2 focus:ring-[var(--clr-emerald-main)]"
            />
            {newErrors.lastName && <ErrorMessage message={newErrors.lastName} />}
          </div>


          {/* Email */}
          <div className="relative col-span-2">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-[var(--corner-md)] border border-[var(--clr-border)] bg-[var(--clr-bg-alt)] px-4 py-3 text-[var(--clr-text-main)] placeholder-[var(--clr-text-subtle)] focus:border-[var(--clr-primary-main)] focus:outline-none focus:ring-2 focus:ring-[var(--clr-emerald-main)]"
            />
            
            {newErrors.email && <ErrorMessage message={newErrors.email}/>}
            </div>

            {/* Mobile */}
            <div className="relative col-span-1">
            <input
              type="tel"
              name="mobile"
              placeholder="Mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
              className="w-full rounded-[var(--corner-md)] border border-[var(--clr-border)] bg-[var(--clr-bg-alt)] px-4 py-3 text-[var(--clr-text-main)] placeholder-[var(--clr-text-subtle)] focus:border-[var(--clr-primary-main)] focus:outline-none focus:ring-2 focus:ring-[var(--clr-emerald-main)]"
            />
            {newErrors.mobile && <ErrorMessage message={newErrors.mobile}/>}            
</div>
            {/* Age */}
            <div className="relative col-span-1">
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              required
              className="w-full rounded-[var(--corner-md)] border border-[var(--clr-border)] bg-[var(--clr-bg-alt)] px-4 py-3 text-[var(--clr-text-main)] placeholder-[var(--clr-text-subtle)] focus:border-[var(--clr-primary-main)] focus:outline-none focus:ring-2 focus:ring-[var(--clr-emerald-main)]"
            />
            
            {newErrors.age && <ErrorMessage message={newErrors.age}/>}
          
            </div>

            {/* Password */}
            <div className="relative col-span-1">
              <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                onCopy={handleBlockPaste}
                onPaste={handleBlockPaste}
                required
                className="w-full rounded-[var(--corner-md)] border border-[var(--clr-border)] 
                bg-[var(--clr-bg-alt)] px-4 py-3 pr-10 text-[var(--clr-text-main)] 
                placeholder-[var(--clr-text-subtle)] focus:border-[var(--clr-primary-main)] 
                focus:outline-none focus:ring-2 focus:ring-[var(--clr-emerald-main)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--clr-text-subtle)] hover:text-[var(--clr-text-main)]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              </div>
            {newErrors.password && <ErrorMessage message={newErrors.password}/>}
            </div>

            {/* Confirm Password */}
            <div className="col-span-1">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onCopy={handleBlockPaste}
                onPaste={handleBlockPaste}
                required
                className="w-full rounded-[var(--corner-md)] border border-[var(--clr-border)] 
                bg-[var(--clr-bg-alt)] px-4 py-3 text-[var(--clr-text-main)] 
                placeholder-[var(--clr-text-subtle)] focus:border-[var(--clr-primary-main)] 
                focus:outline-none focus:ring-2 focus:ring-[var(--clr-emerald-main)]"
              />
              
            {newErrors.confirmPassword && <ErrorMessage message={newErrors.confirmPassword}/>}
            </div>


            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--clr-text-main)]">
                Profile Picture
              </label>
            </div>
            <div className="col-span-2 text-sm text-[var(--clr-text-subtle)] mb-1">
              {formData.role === "lawyer"
                ? "Please upload a profile picture. "
                : "Optional for normal users. "}
                (MAX FILE SIZE 5 MB)
            </div>
            <div className="relative col-span-2">
            <input
              type="file"
              name="profilePic"
              placeholder="Profile Picture"
              accept="image/*"
              onChange={handleFileChange}
              required={formData.role === "lawyer"}
              className="w-full col-span-2 rounded-[var(--corner-md)] border border-[var(--clr-border)] bg-[var(--clr-bg-alt)] px-3 py-2 text-[var(--clr-text-subtle)] 
      file:mr-4 file:rounded-[var(--corner-md)] file:border-0 
      file:bg-[var(--clr-emerald-main)] file:px-4 file:py-2 
      file:text-[var(--clr-text-inverse)] file:cursor-pointer 
      hover:file:bg-[var(--clr-primary-accent)]"
            />
            {newErrors.profilePic && <ErrorMessage message={newErrors.profilePic}/>}
          </div>


            {/* User Type */}
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full col-span-2 rounded-[var(--corner-md)] border border-[var(--clr-border)] bg-[var(--clr-bg-alt)] px-4 py-3 text-[var(--clr-text-main)] focus:border-[var(--clr-primary-main)] focus:outline-none focus:ring-2 focus:ring-[var(--clr-emerald-main)]"
            >
              <option value="user">Normal User</option>
              <option value="lawyer">Lawyer</option>
            </select>

            <div className="relative col-span-2">
              {newErrors.message && <ErrorMessage message={newErrors.message}/>}
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              className="col-span-2 mt-4 rounded-[var(--corner-md)] bg-[var(--clr-primary-main)] px-4 py-3 font-medium text-[var(--clr-text-inverse)] shadow-[var(--shadow-soft)] transition hover:bg-[var(--clr-primary-accent)]"
            >
              Sign Up
            </button>
        </form>

        {/* Login Link */}
        <p
          className="mt-4 text-center text-sm text-[var(--clr-text-subtle)]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="font-medium text-[var(--clr-emerald-main)] hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
