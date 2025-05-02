import { useEffect, useRef, useState } from "react";
import { FiCamera, FiX } from "react-icons/fi";
import { useEditUserModalStore } from "@/stores/modals/modalStore";
import Button from "../Button";
import UserAvatar from "../UserAvatar";
import { useAuthStore } from "@/stores/authStore";
import { useEditUser } from "@/hooks/users/useEditUser";
import Input from "../Input";
import Label from "../Label";
import Loader from "../Loader";

import { useForm } from "react-hook-form";

import { EditUserFormData } from "@/types";

const EditUserModal = () => {
  const { isOpen, closeModal } = useEditUserModalStore();
  const { currentUser } = useAuthStore();
  const { mutate: editUser, isPending } = useEditUser();

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<EditUserFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      bio: ""
    },
    mode: "onChange"
  });

  useEffect(() => {
    if (currentUser) {
      setValue("firstName", currentUser.firstName || "");
      setValue("lastName", currentUser.lastName || "");
      setValue("username", currentUser.username || "");
      setValue("bio", currentUser.bio || "");
    }
  }, [currentUser, setValue]);

  const bio = watch("bio");

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      closeModal();
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      const file = files[0];
      setValue("avatarImage", file);

      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      const file = files[0];
      setValue("coverImage", file);

      const reader = new FileReader();
      reader.onload = () => {
        setCoverPreview(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setValue("avatarImage", undefined);

    setAvatarPreview(null);

    if (avatarInputRef.current) {
      avatarInputRef.current.value = "";
    }
  };

  const removeCover = () => {
    setValue("coverImage", undefined);

    setCoverPreview(null);

    if (coverInputRef.current) {
      coverInputRef.current.value = "";
    }
  };

  const onSubmit = (data: EditUserFormData) => {
    const formData = new FormData();

    if (data.firstName) formData.append("firstName", data.firstName);
    if (data.lastName) formData.append("lastName", data.lastName);
    if (data.username) formData.append("username", data.username);
    if (data.bio) formData.append("bio", data.bio);
    if (data.avatarImage) formData.append("avatarImage", data.avatarImage);
    if (data.coverImage) formData.append("coverImage", data.coverImage);

    editUser(formData, {
      onSuccess: () => {
        closeModal();
        reset();
        setAvatarPreview(null);
        setCoverPreview(null);
      }
    });
  };

  if (!currentUser) return null;
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 dark:bg-black/80 z-50 flex justify-center items-start pt-10 overflow-y-auto"
      onClick={handleOutsideClick}
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl w-full max-w-xl mx-4 shadow-xl mb-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-6">
            <button
              onClick={closeModal}
              className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold">Edit profile</h2>
          </div>
          <Button
            variant="primary"
            size="sm"
            className="rounded-full font-bold py-1"
            onClick={handleSubmit(onSubmit)}
            disabled={isPending}
          >
            {isPending ? <Loader size={20} /> : "Save"}
          </Button>
        </div>

        {/* Cover Image */}
        <div className="relative h-48 w-full">
          {coverPreview ? (
            <>
              <img
                src={coverPreview}
                className="h-full w-full object-cover"
                alt="Cover preview"
              />
              <button
                onClick={removeCover}
                className="absolute top-2 right-2 p-1.5 cursor-pointer rounded-full bg-black/50  hover:bg-black/70 text-white"
              >
                <FiX className="w-4 h-4" />
              </button>
            </>
          ) : currentUser.coverImage ? (
            <img
              src={currentUser.coverImage}
              className="h-full w-full object-cover"
              alt="Current cover"
            />
          ) : (
            <div className="h-48 w-full bg-neutral-300 dark:bg-neutral-600" />
          )}

          <div className="absolute -bottom-16 left-4">
            <div className="relative">
              <UserAvatar
                src={avatarPreview || currentUser.avatarImage || ""}
                className="w-32 h-32 border-4 border-white dark:border-black"
              />
              <button
                onClick={() => avatarInputRef.current?.click()}
                className="absolute bottom-1 right-1 p-2 cursor-pointer rounded-full bg-black/50 hover:bg-black/80 text-white"
              >
                <FiCamera className="w-4 h-4" />
              </button>

              {avatarPreview && (
                <button
                  onClick={removeAvatar}
                  className="absolute top-1 right-1 p-1.5 cursor-pointer rounded-full bg-black/50 hover:bg-black/70 text-white"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}

              <input
                type="file"
                ref={avatarInputRef}
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
          </div>

          <button
            onClick={() => coverInputRef.current?.click()}
            className="absolute bottom-4 right-4 p-2 cursor-pointer rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center gap-1"
          >
            <FiCamera className="w-4 h-4" />
            <span className="text-sm">Add cover image</span>
          </button>
          <input
            type="file"
            ref={coverInputRef}
            accept="image/*"
            onChange={handleCoverChange}
            className="hidden"
          />
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-20 px-4 pb-4 space-y-4"
        >
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Label className="block text-sm font-medium">First name</Label>
              <Input
                {...register("firstName", {
                  required: "First name is required"
                })}
                size="sm"
                placeholder="First name"
                maxLength={50}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="flex-1">
              <Label className="block text-sm font-medium">Last name</Label>
              <Input
                {...register("lastName", { required: "Last name is required" })}
                size="sm"
                placeholder="Last name"
                maxLength={50}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label className="block text-sm font-medium">Username</Label>
            <Input
              {...register("username", { required: "Username is required" })}
              size="sm"
              placeholder="Username"
              maxLength={30}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label className="block text-sm font-medium">Bio</Label>
            <textarea
              {...register("bio")}
              className="w-full p-3 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ease-in-out rounded-md dark:bg-neutral-900 min-h-[100px] resize-none"
              placeholder="Bio"
              maxLength={160}
            />
            <p className="text-xs text-neutral-500 text-right">
              {bio?.length || 0}/160
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
