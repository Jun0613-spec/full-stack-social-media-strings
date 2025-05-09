// import Button from "../Button";
// import Loader from "../Loader";

// import { useDeleteUser } from "@/hooks/users/useDeleteUser";

// import { useConfirmModalStore } from "@/stores/modals/confirmModalStore";

// const DangerZone = () => {
//   const { openModal: openConfirmModal } = useConfirmModalStore();

//   const { mutate: deleteUser, isPending: isDeletePending } = useDeleteUser();

//   const handleDeleteUser = () => {
//     openConfirmModal({
//       title: "Delete Account",
//       message: "Are you sure you want to delete this account?",
//       onConfirm: () => deleteUser()
//     });
//   };

//   return (
//     <div className="flex flex-col space-y-4">
//       <h3 className="font-bold text-lg text-red-500 dark:text-red-400">
//         Danger Zone
//       </h3>
//       <p className="text-sm text-neutral-700 dark:text-neutral-400">
//         Once you delete an account, it cannot be recovered. Please be certain.
//       </p>
//       <div className="border-t border-neutral-300 dark:border-neutral-600 mt-4" />
//       <div className="flex items-center justify-end mt-4">
//         <Button
//           type="button"
//           variant="danger"
//           size="sm"
//           disabled={isDeletePending}
//           onClick={handleDeleteUser}
//         >
//           {isDeletePending ? (
//             <Loader className="size-5 text-white" />
//           ) : (
//             "Delete Account"
//           )}
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default DangerZone;

import { HiTrash } from "react-icons/hi2";
import Button from "../Button";
import Loader from "../Loader";
import { useDeleteUser } from "@/hooks/users/useDeleteUser";
import { useConfirmModalStore } from "@/stores/modals/confirmModalStore";

const DangerZone = () => {
  const { openModal: openConfirmModal } = useConfirmModalStore();
  const { mutate: deleteUser, isPending: isDeletePending } = useDeleteUser();

  const handleDeleteUser = () => {
    openConfirmModal({
      title: "Delete Account",
      message:
        "Are you sure you want to permanently delete your account? This action cannot be undone.",
      onConfirm: () => deleteUser()
    });
  };

  return (
    <section className="max-w-4xl">
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-500">
            Danger Zone
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Permanent actions that cannot be undone
          </p>
        </div>

        <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-medium text-neutral-900 dark:text-white">
                Delete Account
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Permanently remove your account and all associated data
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDeleteUser}
              disabled={isDeletePending}
              className="w-full sm:w-auto"
            >
              {isDeletePending ? (
                <Loader className="size-5 text-white" />
              ) : (
                <>
                  <HiTrash className="w-4 h-4 mr-2 " />
                  <span> Delete Account</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DangerZone;
