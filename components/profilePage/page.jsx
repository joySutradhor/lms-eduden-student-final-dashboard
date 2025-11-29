"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Topbar from "../topbar/page";
import Image from "next/image";
import { useToken } from "../hooks/GetToken";
import axios from "axios";
import CommonBanner from "../common/commonBanner";
import Swal from "sweetalert2";
import { FaSignOutAlt, FaUserEdit, FaSave, FaCamera } from "react-icons/fa";
import { MdOutlinePassword } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";

export default function ProfilePage() {
  const pathname = usePathname();
  const router = useRouter();
  const [token, userId] = useToken();
  const [data, setData] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  
  const [form, setForm] = useState({
    full_name: "",
    contact_number: "",
    whatsapp_number: "",
    address: "",
    date_of_birth: "",
    gender: "",
    picture: null,
  });

  // for password change
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const formattedPath = pathname
    .replace(/^\/|\/$/g, "")
    .split("/")
    .map((segment) =>
      segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
    )
    .join(" / ");

  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://lmsapi.eduden.io/api/profile-update/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        const profile = response?.data;
        setData(profile);
        setForm({
          full_name: profile.full_name || "",
          contact_number: profile.contact_number || "",
          whatsapp_number: profile.whatsapp_number || "",
          address: profile.address || "",
          date_of_birth: profile.date_of_birth || "",
          gender: profile.gender || "",
          picture: null,
        });
        setImagePreview(profile.picture);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);

  console.log(data);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, picture: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update your profile?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FBBD08",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    });

    if (!result.isConfirmed) return;

    try {
      const formData = new FormData();
      formData.append("full_name", form.full_name);
      formData.append("contact_number", form.contact_number);
      formData.append("whatsapp_number", form.whatsapp_number);
      formData.append("address", form.address);
      formData.append("date_of_birth", form.date_of_birth);
      formData.append("gender", form.gender);
      if (form.picture instanceof File) {
        formData.append("picture", form.picture);
      }

      for (let singleData of formData.entries()) {
        console.log(`${singleData[0]}:`, singleData[1]);
      }

      await axios.patch(
        `https://lmsapi.eduden.io/api/profile-update/`,
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Swal.fire("Updated!", "Your profile has been updated.", "success");
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire("Error", "Failed to update profile.", "error");
    }
  };

  const handleLogout = async () => {
    

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out from your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#111",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log me out!",
    });

    if (result.isConfirmed) {
      try {
        await axios.get("https://lmsapi.eduden.io/api/logout", {
          withCredentials: true,
        });
        localStorage.clear();
        Swal.fire("Logged Out!", "You have been logged out.", "success");
        router.push("/login");
      } catch (error) {
        console.error("Logout failed:", error);
        Swal.fire("Error!", "Unable to logout. Try again.", "error");
      }
    }
  };

  // password change fucntion
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitChangePassword = async (e) => {
    e.preventDefault();

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      return Swal.fire("Error", "New passwords do not match.", "error");
    }

    try {
      await axios.post(
        "https://lmsapi.eduden.io/api/change-password/",
        passwordForm,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      Swal.fire("Success", "Password changed successfully.", "success");
      setShowPasswordModal(false);
      setPasswordForm({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to change password.", "error");
    }
  };

  return (
    <section className="edn__sideToLeftSpace">
      <div className="edn__left__right__space">
        <Topbar title={formattedPath} />

        <div className="common_layout">
          <div className="bg-white rounded-xl px-5 pt-5 pb-1 order_layout_two">
            <h3 className="edn__section__title mb-4">Profile</h3>

            {data ? (
              <form onSubmit={handleSubmit} className="">
                <div className="flex justify-center items-center col-span-2 mb-5 relative">
                  <Image
                    height={100}
                    width={100}
                    alt="Profile Img"
                    src={imagePreview || "/default-avatar.png"}
                    className="rounded-full size-36 object-cover"
                  />
                  <label className="flex justify-end bg-black text-white p-2 rounded-full cursor-pointer mt-16">
                    <div>
                      <FaCamera />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        hidden
                      />
                    </div>
                  </label>
                </div>

                <div className="grid md:grid-cols-2 gap-5 ">
                  <div>
                    <label className="flex flex-col ">
                      Full Name
                      <input
                        type="text"
                        name="full_name"
                        value={form.full_name}
                        onChange={handleChange}
                        placeholder="Full Name"
                        className="p-2 border border-black/10 rounded outline-none mt-1 edn__small__text"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="flex flex-col">
                      Contact Number
                      <input
                        type="text"
                        name="contact_number"
                        value={form.contact_number}
                        onChange={handleChange}
                        placeholder="Contact Number"
                        className="p-2 border border-black/10 rounded outline-none mt-1 edn__small__text"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="flex flex-col">
                      WhatsApp Number
                      <input
                        type="text"
                        name="whatsapp_number"
                        value={form.whatsapp_number}
                        onChange={handleChange}
                        placeholder="WhatsApp Number"
                        className="p-2 border border-black/10 rounded outline-none mt-1 edn__small__text"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="flex flex-col">
                      Address
                      <input
                        type="text"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="Address"
                        className="p-2 border border-black/10 rounded outline-none mt-1 edn__small__text"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="flex flex-col">
                      Date of Birth
                      <input
                        type="date"
                        name="date_of_birth"
                        value={form.date_of_birth}
                        onChange={handleChange}
                        className="p-2 border border-black/10 rounded outline-none mt-1 edn__small__text"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="flex flex-col">
                      Gender
                      <select
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        className="p-2 border border-black/10 rounded outline-none mt-1 edn__small__text"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </label>
                  </div>
                </div>

                <div className=" grid  md:grid-cols-2 justify-between items-center py-10">
                  <div className="flex gap-x-6 items-center flex-wrap gap-y-3 md:gap-y-0 mb-5 md:mb-0 ">
                    <div className="">
                      <button
                        type="submit"
                        className="flex items-center gap-2 bg-[#FBBD08] text-black py-2 px-6 rounded cursor-pointer"
                      >
                        <FaSave /> Update Profile
                      </button>
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-[#111] text-white py-2 px-6 rounded cursor-pointer "
                      >
                        <FaSignOutAlt /> Logout
                      </button>
                    </div>
                  </div>
                  {/* change password */}
                  <div className="flex md:justify-end">
                    <button
                      type="button"
                      onClick={() => setShowPasswordModal(true)}
                      className="flex items-center gap-2 bg-gray-50 text-black py-2 px-6 rounded cursor-pointer "
                    >
                      <MdOutlinePassword /> Change Password
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <p>Loading profile...</p>
            )}
          </div>

          {showPasswordModal && (
            <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
              <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
                <button
                  className="absolute top-4 right-3 cursor-pointer text-gray-500 hover:text-red-500 text-xl"
                  onClick={() => setShowPasswordModal(false)}
                >
                  <IoCloseSharp />
                </button>
                <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                <form onSubmit={submitChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium">
                      Old Password
                    </label>
                    <input
                      type="text"
                      name="old_password"
                      value={passwordForm.old_password}
                      onChange={handlePasswordChange}
                      className="w-full mt-1 border border-gray-300 rounded px-3 py-2 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      New Password
                    </label>
                    <input
                      type="text"
                      name="new_password"
                      value={passwordForm.new_password}
                      onChange={handlePasswordChange}
                      className="w-full mt-1 border border-gray-300 rounded px-3 py-2 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      Confirm Password
                    </label>
                    <input
                      type="text"
                      name="confirm_password"
                      value={passwordForm.confirm_password}
                      onChange={handlePasswordChange}
                      className="w-full mt-1 border border-gray-300 rounded px-3 py-2 outline-none"
                      required
                    />
                  </div>
                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="bg-[#FBBD08] text-black px-6 py-2 rounded hover:bg-yellow-400 flex items-center gap-x-2 cursor-pointer"
                    >
                      <FaSave /> Update Password
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="order_layout_first">
            <CommonBanner />
          </div>
        </div>
      </div>
    </section>
  );
}
