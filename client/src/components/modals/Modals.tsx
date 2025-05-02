import ConfirmModal from "./ConfirmModal";
import CreatePostModal from "./CreatePostModal";
import EditPostModal from "./EditPostModal";
import EditReplyModal from "./EditReplyModal";
import EditUserModal from "./EditUserModal";
import ReplyModal from "./ReplyModal";

const Modals = () => {
  return (
    <>
      <ConfirmModal />
      <CreatePostModal />
      <EditPostModal />
      <ReplyModal />
      <EditReplyModal />
      <EditUserModal />
    </>
  );
};

export default Modals;
